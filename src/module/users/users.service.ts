import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { Opt } from '../otp/otp.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Opt)
        private readonly OptRepository: Repository<Opt>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // check exist phoneNumber
        if (await this.findUserByPhoneNumber(createUserDto.phoneNumber)) {
            throw new NotFoundException(`کاربری با شماره تلفن ${createUserDto.phoneNumber} در سیستم موجود است`);
        }

        // check verify otp code
        const OTP = (await this.OptRepository.find({ where: { phoneNumber: createUserDto.phoneNumber } }).then((item)=> item)).at(-1);

        if (!OTP) {
            throw new NotFoundException(`شماره تلفن ${createUserDto.phoneNumber} تایید نشده است`);
        }

        if (!OTP.isVerified) {
            throw new NotFoundException(`شماره تلفن ${createUserDto.phoneNumber} تایید نشده است`);
        }

        const newUser = this.userRepository.create(createUserDto);
        await newUser.setPassword(createUserDto.password);
        return this.userRepository.save(newUser);
    }

    async findUserById(id: number, hidePassword?: boolean): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`کاربری با شناسه ${id} یافت نشد`);
        }

        if(hidePassword){
            delete user.password;
            return user;
        }
        return user;
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findUserByPhoneNumber(phoneNumber: string) {
        return this.userRepository.findOne({ where: { phoneNumber } });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findUserById(id);
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.findUserById(id);
        await this.userRepository.remove(user);
    }

    async setPassword(id: number, newPassword: string): Promise<void> {
        const user = await this.findUserById(id);
        await user.setPassword(newPassword);
        await this.userRepository.save(user);
    }
}
