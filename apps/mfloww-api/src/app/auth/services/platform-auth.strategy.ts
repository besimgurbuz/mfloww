import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PlatformUser } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class PlatformAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'accessToken' });
  }

  async validate(email: string, accessToken: string): Promise<PlatformUser> {
    const platformUser = await this.authService.validatePlatformUser(
      email,
      accessToken
    );

    if (!platformUser) {
      throw new UnauthorizedException();
    }
    return platformUser;
  }
}
