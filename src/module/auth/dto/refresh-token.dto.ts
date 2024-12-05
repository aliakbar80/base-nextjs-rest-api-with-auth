import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'توکن ریفرش نامعتبر است',
  })
  refreshToken: string;
}

export default RefreshTokenDto;
