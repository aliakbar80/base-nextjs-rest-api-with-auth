import {
  Body,
  Controller,
  Delete,
  Ip,
  NotAcceptableException,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import RefreshTokenDto from './dto/refresh-token.dto';
import { LoginCheckDto, LoginDto, LoginOtpDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UseFileAndAnyContent } from '@/common/decorators/use-file-and-any-content.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseFileAndAnyContent()
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return await this.authService.login(body.phoneNumber, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('check-exist')
  @UseFileAndAnyContent()
  async CheckExistPhoneNumber(
    @Body() LoginCheckDto: LoginCheckDto,
  ): Promise<any> {
    return this.authService.CheckExistPhoneNumber(LoginCheckDto);
  }

  @Post('login/otp')
  @UseFileAndAnyContent()
  async LoginOtp(@Req() request, @Ip() ip: string, @Body() body: LoginOtpDto) {
    return await this.authService.loginWithOtp(body.phoneNumber, body.code, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('register')
  @UseFileAndAnyContent()
  async createUser(
    @Req() request,
    @Ip() ip: string,
    @Body() userData: CreateUserDto,
  ): Promise<{ msg: string; accessToken: string } | NotAcceptableException> {
    const user = await this.authService.createUserWithAccessToken(
      {
        ipAddress: ip,
        userAgent: request.headers['user-agent'],
      },
      userData,
    );
    return user;
  }

  @Post('refresh')
  @UseFileAndAnyContent()
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.authService.refresh(body.refreshToken);
  }

  @Delete('logout')
  @UseFileAndAnyContent()
  async logout(@Body() body: RefreshTokenDto) {
    return await this.authService.logout(body.refreshToken);
  }
}
