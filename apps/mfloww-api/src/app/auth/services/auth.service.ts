import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlatformUser, User } from '@prisma/client';
import { hashPassword } from '../../shared/utils';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByEmail(email);

    if (user && hashPassword(password, user.key) === user.password) {
      return {
        ...user,
        password: null,
      };
    }

    return null;
  }

  async validatePlatformUser(
    email: string,
    accessToken: string
  ): Promise<PlatformUser | null> {
    const platformUser = await this.userService.getPlatformUserByEmail(email);

    if (platformUser && platformUser.accessToken === accessToken) {
      return {
        ...platformUser,
        accessToken: null,
      };
    }
    return null;
  }

  async login(user: User | PlatformUser) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      key: user.key,
      platform: (user as PlatformUser).platform,
    };
    const now = Date.now();

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: now + process.env.JWT_TOKEN_EXPIRE_TIME,
      }),
      expiresIn: now + process.env.JWT_TOKEN_EXPIRE_TIME,
      key: user.key,
    };
  }
}
