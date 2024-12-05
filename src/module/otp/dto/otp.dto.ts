import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsNotEmpty, Length } from 'class-validator';

export class CreateOptDto {
  @ApiProperty()
  @IsString()
  @IsPhoneNumber('IR', { message: 'شماره موبایل باید ایرانی باشد' })
  phoneNumber: string;
}

export class verifyCodeDto {
  @ApiProperty()
  @IsString()
  @IsPhoneNumber('IR', { message: 'شماره موبایل باید ایرانی باشد' })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @Length(4, 4, { message: 'کد تایید باید 4 رقم باشد' })
  @IsNotEmpty()
  code: string;
}
