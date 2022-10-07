import {
  Body,
  ConsoleLogger,
  Controller,
  Post,
  Put,
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
    UserController.logger.debug(
      `handling createNewUser request with: { username: ${userDto.username}, email: ${userDto.email} }`
    );
    return this.userService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(@Body() userDto: UserDto) {
    return userDto;
  }
}
