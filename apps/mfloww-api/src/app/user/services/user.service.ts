import { ConsoleLogger, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashPassword } from '../../shared/utils';
import { UserCreationResultDto, UserDto } from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private static readonly logger = new ConsoleLogger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUser({ email });
  }

  async createUser(userDto: UserDto): Promise<UserCreationResultDto> {
    const newUserKey = randomBytes(64).toString('hex');
    const result = await this.userRepository
      .createUser({
        ...userDto,
        password: hashPassword(userDto.password, newUserKey),
        key: newUserKey,
      })
      .catch((error) => {
        UserService.logger.debug(`failed to create a new user: ${error}`);
      });

    if (!result) {
      return { error: 'Failed to create a new user, please try again' };
    }

    return {
      key: result.key,
      email: result.email,
      username: result.username,
    };
  }
}
