import { Injectable } from '@nestjs/common';
import { hashPassword } from '../../shared/utils';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

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
}
