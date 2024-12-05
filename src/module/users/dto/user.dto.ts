import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Gender } from '../users.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber('IR', { message: 'شماره موبایل باید ایرانی باشد' })
  phoneNumber: string;

  @ApiProperty({
    title: 'تاریخ تولد',
    description: 'YYYY-MM-DD',
    example: '1998-01-01',
    type: 'string',
    format: 'date',
    default: new Date().toISOString().split('T')[0],
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({
    enum: Gender,
    enumName: 'Gender',
    default: Gender.Female,
    required: true,
    description: 'Gender',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    },
    { message: 'رمز عبور خیلی ضعیف است' },
  )
  @IsNotEmpty()
  password?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsPhoneNumber('IR', { message: 'شماره موبایل باید ایرانی باشد' })
  phoneNumber?: string;

  @ApiProperty({
    title: 'تاریخ تولد',
    description: 'YYYY-MM-DD',
    example: '1998-01-01',
    type: 'string',
    format: 'date',
    default: new Date().toISOString().split('T')[0],
    required: true,
  })
  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
