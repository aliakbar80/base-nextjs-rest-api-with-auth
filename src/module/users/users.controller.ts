import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { User } from './users.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseFileAndAnyContent } from '@/common/decorators/use-file-and-any-content.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findUserById(@Req() request): Promise<User> {
    const userId = request.user.userId;
    return this.usersService.findUserById(userId, true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/username/:username')
  async findUserByUsername(
    @Param('username') username: string,
  ): Promise<User | undefined> {
    return this.usersService.findUserByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseFileAndAnyContent()
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/set-password')
  async setPassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ): Promise<void> {
    return this.usersService.setPassword(id, password);
  }
}
