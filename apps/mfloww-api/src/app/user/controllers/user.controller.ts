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
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { hashPassword } from '../../shared/utils';
import { UpdatePasswordDto, UpdateUserDto, UserDto } from '../dtos/user.dto';
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
        `failed to create a new user { data: ${userDto}} ${err}`
      );
      res.status(400).send({
        code: err.code === 'P2002' ? 409 : 400,
        message:
          err.code === 'P2002'
            ? 'Opps, it looks like the email you want to use is taken already.'
            : err?.message ||
              'Failed to create a new user with given credentials.',
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
      const clearedBody: Record<string, unknown> = { ...body };
      delete clearedBody.password;
      delete clearedBody.id;
      delete clearedBody.key;
      const result = await this.userService.updateUser(req.user, clearedBody);
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
  @Put('password')
  async updatePassword(
    @Request() req,
    @Res() res: Response,
    @Body() body: UpdatePasswordDto
  ) {
    try {
      const isPasswordCorrect = await this.userService.isPasswordCorrect(
        req.user,
        body.currentPassword
      );

      if (!isPasswordCorrect) {
        res.status(401).send({
          code: 401,
          message: 'Password is incorrect',
        });
        return;
      }

      const result = await this.userService.updateUser(req.user, {
        password: hashPassword(body.newPassword, req.user.key),
      });
      res.status(200).send(result);
    } catch (err) {
      UserController.logger.debug(
        `failed to update the password of a user: { where: { id: ${
          req.user.id
        } }, data: ${JSON.stringify(body)}, error: ${JSON.stringify(err)} }`
      );

      res.status(400).send({
        code: 400,
        message: 'Failed to update the password. Please try again.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfileInfo(@Request() req) {
    return this.userService.getProfile(req.user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    UserController.logger.log('google platform using for authentication');
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Res() res: Response, @Req() req) {
    if (process.env.ENABLE_USER_CREATION !== 'ENABLED') {
      throw new HttpException(
        'User creation is currently blocked',
        HttpStatus.FORBIDDEN
      );
    }
    try {
      const { user: googleUser } = req;
      const platformUser =
        await this.userService.handlePlatformUserRegisteration(googleUser);

      return res.redirect(
        `/user/platform-redirect?email=${platformUser.email}&accessToken=${platformUser.accessToken}&platform=${platformUser.platform}`
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
