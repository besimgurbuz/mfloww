import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
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
}
