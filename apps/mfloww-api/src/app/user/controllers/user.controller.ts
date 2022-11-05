import {
  Body,
  ConsoleLogger,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@Controller({
  path: '/user',
})
export class UserController {
  private static readonly logger = new ConsoleLogger(UserController.name);

  constructor(private userService: UserService) {}

  @Post()
  createNewUser(@Body() userDto: UserDto) {
    if (process.env.ENABLE_USER_CREATION !== 'ENABLED') {
      throw new HttpException(
        'User creation is currently forbidden',
        HttpStatus.FORBIDDEN
      );
    }
    UserController.logger.debug(
      `handling createNewUser request with: { username: ${userDto.username}, email: ${userDto.email} }`
    );
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(@Request() req, @Body() body: UserDto) {
    return this.userService.updateUser(req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Request() req) {
    return this.userService.deleteUser(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfileInfo(@Request() req) {
    return this.userService.getProfile(req.user);
  }
}
