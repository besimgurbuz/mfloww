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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto, UserDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@Controller({
  path: '/user',
})
export class UserController {
  private static readonly logger = new ConsoleLogger(UserController.name);

  constructor(private userService: UserService) {}

  @Post()
  async createNewUser(@Res() res: Response, @Body() userDto: UserDto) {
    if (process.env.ENABLE_USER_CREATION !== 'ENABLED') {
      throw new HttpException(
        'User creation is currently blocked',
        HttpStatus.FORBIDDEN
      );
    }
    try {
      UserController.logger.debug(
        `handling createNewUser request with: { username: ${userDto.username}, email: ${userDto.email} }`
      );
      const result = await this.userService.createUser(userDto);
      res.status(201).send(result);
    } catch (err) {
      UserController.logger.debug(
        `failed to create a new user { data: ${userDto}}`
      );
      res.status(400).send({
        code: err.code === 'P2002' ? 409 : 400,
        message:
          err.code === 'P2002'
            ? 'Opps, it looks like the email you want to use is taken already.'
            : 'Failed to create a new user with given credentials.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @Request() req,
    @Res() res: Response,
    @Body() body: UpdateUserDto
  ) {
    try {
      const result = await this.userService.updateUser(req.user, body);
      res.status(200).send(result);
    } catch (err) {
      UserController.logger.debug(
        `failed to update a user: { where: { id: ${
          req.user.id
        } }, data: ${JSON.stringify(body)}, error: ${JSON.stringify(err)} }`
      );

      res.status(400).send({
        code: err.code === 'P2002' ? 409 : 400,
        message:
          err.code === 'P2002'
            ? 'Opps, it looks like the email you want to use is taken already.'
            : "Couldn't update the profile.",
      });
    }
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
