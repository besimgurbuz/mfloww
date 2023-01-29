import { ConsoleLogger, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { hashPassword } from '../../shared/utils';
import {
  PlatformUserDto,
  ProfileInfoDto,
  UpdateUserDto,
  UserActionResult,
  UserDto,
} from '../dtos/user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private static readonly logger = new ConsoleLogger(UserService.name);

  constructor(private userRepository: UserRepository) {}

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUser({ email });
  }

  async createUser(userDto: UserDto): Promise<UserActionResult> {
    const newUserKey = randomBytes(64).toString('hex');
    const result = await this.userRepository.createUser({
      ...userDto,
      password: hashPassword(userDto.password, newUserKey),
      key: newUserKey,
    });
    return {
      key: result.key,
      email: result.email,
      username: result.username,
    };
  }
  async updateUser(
    { id }: User,
    updatePayload: UpdateUserDto
  ): Promise<UserActionResult> {
    // if (updatePayload.password) {
    //   updatePayload.password = hashPassword(updatePayload.password, key);
    // }
    const result = await this.userRepository.updateUser({
      where: { id },
      data: updatePayload,
    });

    return {
      key: result.key,
      email: result.email,
      username: result.username,
    };
  }

  async deleteUser({ id }: User): Promise<UserActionResult> {
    try {
      const result = await this.userRepository.deleteUser({ id });

      return {
        key: result.key,
        email: result.email,
        username: result.username,
      };
    } catch (err) {
      UserService.logger.debug(
        `failed to delete a user: { where: { id: ${id} } }`
      );
      return {
        error: 'Failed to delete the user',
      };
    }
  }

  async getProfile(user: User): Promise<ProfileInfoDto> {
    return {
      username: user.username,
      email: user.email,
      key: user.key,
    };
  }

  async getPlatformUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getPlatformUser({ email });
  }

  async createPlatformUser(
    platformUserDto: PlatformUserDto
  ): Promise<UserActionResult> {
    const newUserKey = randomBytes(64).toString('hex');
    const result = await this.userRepository.createPlatformUser({
      ...platformUserDto,
      key: newUserKey,
    });
    return {
      key: result.key,
      email: result.email,
      username: result.username,
      platform: platformUserDto.platform,
    };
  }
}
