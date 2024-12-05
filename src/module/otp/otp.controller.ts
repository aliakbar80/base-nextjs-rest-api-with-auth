import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { OptService } from './otp.service';
import { CreateOptDto, verifyCodeDto } from './dto/otp.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseFileAndAnyContent } from '@/common/decorators/use-file-and-any-content.decorator';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth/otp')
export class OptController {
  constructor(private readonly optService: OptService) {}

  @Post('send-code')
  @UseFileAndAnyContent()
  @HttpCode(HttpStatus.CREATED)
  async sendCode(@Body() createOptDto: CreateOptDto) {
    return this.optService.create(createOptDto);
  }

  @Post('verify-code')
  @UseFileAndAnyContent()
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() VerifyCodeDto: verifyCodeDto) {
    const { phoneNumber, code } = VerifyCodeDto;
    const isVerified = await this.optService.verifyCode(phoneNumber, code);
    return { isVerified };
  }
}
