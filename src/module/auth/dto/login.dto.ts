import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'شماره تلفن را وارد کنید',
  })
  phoneNumber: string;
  
  @ApiProperty()
  @IsNotEmpty({
    message: 'رمز عبور را وارد کنید',
  })
  password: string;
}

export class LoginOtpDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'شماره تلفن را وارد کنید',
  })
  phoneNumber: string;
  
  @ApiProperty()
  @IsString()
  @Length(4, 4,{
    message: 'کد تایید باید 4 رقم باشد',
  })
  @IsNotEmpty()
  @IsNotEmpty({
    message: 'کد تایید را وارد کنید',
  })
  code: string;
}

export class LoginCheckDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'شماره تلفن را وارد کنید',
  })
  phoneNumber: string;
}