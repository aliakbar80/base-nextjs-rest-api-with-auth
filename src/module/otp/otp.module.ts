import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptService } from './otp.service';
import { Opt } from './otp.entity';
import { OptController } from './otp.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Opt])],
    providers: [OptService],
    controllers: [OptController],
    exports: [OptService],
})

export class OtpModule { }
