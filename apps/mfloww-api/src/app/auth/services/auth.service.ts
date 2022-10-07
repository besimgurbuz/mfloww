import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../../shared/utils';
import { UserDto } from '../../user/dtos/user.dto';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);

    if (user && hashPassword(password, user.key) === user.password) {
      return {
        ...user,
        password: null,
      };
    }

    return null;
  }

  async login(user: UserDto) {
    const payload = {
      email: user.email,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
