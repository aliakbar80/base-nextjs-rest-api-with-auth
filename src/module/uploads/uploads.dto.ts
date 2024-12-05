import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
  isNumber,
} from 'class-validator';

export class CreateUploadDto {
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  size: number;

  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}

export class CreateUploadNameDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
