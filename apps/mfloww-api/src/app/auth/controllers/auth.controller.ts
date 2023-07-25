import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { PlatformAuthGuard } from '../guards/platform-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller({
  path: '/auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Response() res) {
    const result = await this.authService.login(req.user);
    res.cookie('XSRF-TOKEN', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.send(result);
  }

  @UseGuards(PlatformAuthGuard)
  @Post('/login/platform')
  async loginWithPlatform(@Request() req, @Response() res) {
    const result = await this.authService.login(req.user);
    res.cookie('XSRF-TOKEN', result.access_token, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.send(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Request() req, @Response() res) {
    if (!req.user) {
      res.send({
        message: 'Session not found to log out',
      });
      return;
    }

    res.cookie('XSRF-TOKEN', 'DELETED', { httpOnly: true, sameSite: 'strict' });
    res.send({
      message: 'Logged out',
    });
  }
}
