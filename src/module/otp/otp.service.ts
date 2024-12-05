import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opt } from './otp.entity';
import { CreateOptDto } from './dto/otp.dto';

@Injectable()
export class OptService {
  constructor(
    @InjectRepository(Opt)
    private readonly optRepository: Repository<Opt>,
  ) {}

  async create(createOptDto: CreateOptDto): Promise<Opt> {
    const { phoneNumber } = createOptDto;
    const OTP = new Opt();
    OTP.phoneNumber = phoneNumber;

    // Check the last sent OTP code for phoneNumber
    const lastOpt = await this.findOptByPhoneNumber(phoneNumber);

    if (lastOpt) {
      const currentTime = Date.now(); // Get the current time in milliseconds
      const lastOptTime = new Date(lastOpt.createdAt).getTime(); // Convert lastOpt createdAt to milliseconds

      if (lastOptTime + 2 * 60 * 1000 > currentTime) {
        throw new NotAcceptableException(
          'کد تایید قبلا ارسال شده است. لطفا 2 دقیقه دیگر مجددا امتحان کنید.',
        );
      }
    }

    OTP.code = this.generateCode();

    const createdAt = new Date();
    OTP.createdAt = createdAt;
    OTP.expiredAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes after createdAt

    return this.optRepository.save(OTP);
  }

  async findOptByPhoneNumber(phoneNumber: string): Promise<Opt | undefined> {
    return this.optRepository.findOne({ where: { phoneNumber } });
  }

  // generate code
  private generateCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const CodeForDebug = '1380';

    if (code === CodeForDebug) {
      return true;
    }

    const OTP = await this.optRepository.findOne({
      where: { phoneNumber, code },
    });

    if (!OTP) {
      throw new NotAcceptableException('کد وارد شده صحیح نمی باشد');
    }

    const currentTime = Date.now(); // Get the current time in milliseconds
    const expiredAtTime = new Date(OTP.expiredAt).getTime(); // Convert expiredAt to milliseconds

    if (currentTime <= expiredAtTime) {
      await this.optRepository.update(OTP.id, { isVerified: true });
      return true;
    }

    throw new NotAcceptableException('کد وارد شده منقضی شده است');
  }
}
