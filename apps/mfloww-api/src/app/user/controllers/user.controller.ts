import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

@Controller({
  path: '/user',
})
export class UserController {
  private static readonly logger = new ConsoleLogger(UserController.name);

  @Post()
  createNewUser(@Body() userDto: UserDto) {
    throw new Error('IMPL');
  }
}
