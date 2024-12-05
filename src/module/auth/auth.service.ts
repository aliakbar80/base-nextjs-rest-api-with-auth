import {
  BadRequestException,
  Body,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { CreateUserDto } from '../users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { OptService } from '../otp/otp.service';
import { LoginCheckDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly otpService: OptService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private async retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decoded = verify(refreshStr, process.env.REFRESH_SECRET);

      if (typeof decoded === 'string') {
        return undefined;
      }

      return await this.refreshTokenRepository.findOne({
        where: { id: decoded.id },
      });
    } catch (error) {
      return error;
    }
  }

  async CheckExistPhoneNumber(LoginCheckDto: LoginCheckDto) {
    const isExist = await this.userService.findUserByPhoneNumber(
      LoginCheckDto.phoneNumber,
    );

    return {
      isExist: !!isExist,
    };
  }

  async createUserWithAccessToken(
    value: { userAgent: string; ipAddress: string },
    @Body() userData: CreateUserDto,
  ): Promise<
    | { msg: string; accessToken: string; refreshToken: string }
    | NotAcceptableException
  > {
    // Validate the incoming data using the CreateUserDto
    const { phoneNumber } = userData;

    if (!!(await this.userService.findUserByPhoneNumber(phoneNumber))) {
      throw new BadRequestException('شماره همراه قبلا ثبت شده');
    }

    const user = await this.userService.createUser(userData);

    // Generate an access token
    const jwt = await this.newRefreshAndAccessToken(user, value);

    return {
      msg: 'کاربر با موفقیت ثبت شد',
      accessToken: jwt.accessToken,
      refreshToken: jwt.refreshToken,
    };
  }

  async refresh(
    refreshStr: string,
  ): Promise<{ accessToken: string } | undefined> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      return undefined;
    }

    const user = await this.userService.findUserById(refreshToken.userId);

    if (!user) {
      return undefined;
    }

    const accessToken = {
      userId: refreshToken.userId,
    };

    return {
      accessToken: sign(accessToken, process.env.ACCESS_SECRET, {
        expiresIn: '300h',
      }),
    };
  }

  async login(
    phoneNumber: string,
    password: string,
    value: { userAgent: string; ipAddress: string },
  ): Promise<
    | { accessToken: string; refreshToken: string }
    | undefined
    | NotFoundException
  > {
    const user = await this.userService.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است !');
    }

    const passwordConfrim = await bcrypt.compare(password, user.password);

    if (!passwordConfrim) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است !');
    }

    return this.newRefreshAndAccessToken(user, value);
  }

  async loginWithOtp(
    phoneNumber: string,
    code: string,
    value: { userAgent: string; ipAddress: string },
  ): Promise<
    | { accessToken: string; refreshToken: string }
    | undefined
    | NotFoundException
  > {
    const user = await this.userService.findUserByPhoneNumber(phoneNumber);
    if (!user) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است !');
    }

    const otp = await this.otpService.verifyCode(phoneNumber, code);

    if (!otp) {
      throw new UnauthorizedException('کد تاییدیه اشتباه است !');
    }

    return this.newRefreshAndAccessToken(user, value);
  }

  async newRefreshAndAccessToken(
    user: User,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshObject = new RefreshToken(
      user.id,
      values.userAgent,
      values.ipAddress,
    );

    const savedRefreshToken =
      await this.refreshTokenRepository.save(refreshObject);

    return {
      refreshToken: savedRefreshToken.sign(),
      accessToken: sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expiresIn: '300h',
      }),
    };
  }

  async logout(refreshStr: string): Promise<{ message: string }> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken)
      return new NotFoundException({ message: 'رفرش توکن نامعتبر است' });

    // delete refresh token from db
    await this.refreshTokenRepository.delete(refreshToken.id);

    return { message: 'ok' };
  }
}
