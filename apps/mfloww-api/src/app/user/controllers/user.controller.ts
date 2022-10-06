import { Body, ConsoleLogger, Controller, Post } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';

@Controller({
  path: '/user',
})
export class UserController {
  private static readonly logger = new ConsoleLogger(UserController.name);

  @Post()
  loginToUser(@Body() body: UserDto) {
    UserController.logger.log(body);
  }

  @Post('/new')
  createNewUser() {
    throw new Error('IMPL');
  }
}
