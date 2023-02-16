import { SupportedPlatform } from '@mfloww/common';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PlatformUser, Prisma, User } from '@prisma/client';
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
    const platformUserRecord = await this.getPlatformUserByEmail(userDto.email);
    if (
      platformUserRecord &&
      userDto.username !== platformUserRecord.username
    ) {
      this.updatePlatformUser(
        { id: platformUserRecord.id },
        { username: userDto.username }
      );
    }
    const newUserKey = randomBytes(64).toString('hex');
    const result = await this.userRepository.createUser({
      ...userDto,
      password: hashPassword(
        userDto.password,
        platformUserRecord?.key || newUserKey
      ),
      key: platformUserRecord?.key || newUserKey,
    });
    return {
      key: result.key,
      email: result.email,
      username: result.username,
    };
  }

  async updateUser(
    { id, key }: User,
    updatePayload: UpdateUserDto
  ): Promise<UserActionResult> {
    if (updatePayload.password) {
      updatePayload.password = hashPassword(updatePayload.password, key);
    }
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

  async getProfile(user: User | PlatformUser): Promise<ProfileInfoDto> {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      key: user.key,
      platform: (user as PlatformUser).platform as SupportedPlatform,
    };
  }

  async getPlatformUserByEmail(email: string): Promise<PlatformUser | null> {
    return this.userRepository.getPlatformUser({ email });
  }

  async handlePlatformUserRegisteration(
    user: PlatformUserDto
  ): Promise<PlatformUser> {
    const nonPlatformRecord = await this.getUserByEmail(user.email);
    let platformUser = await this.getPlatformUserByEmail(user.email);
    if (platformUser && user.accessToken !== platformUser.accessToken) {
      platformUser = await this.updatePlatformUser(
        { id: platformUser.id },
        {
          accessToken: user.accessToken,
        }
      );
    } else {
      platformUser = await this.createPlatformUser(
        {
          ...user,
          username: nonPlatformRecord && nonPlatformRecord.username,
          platform: SupportedPlatform.GOOGLE,
        },
        nonPlatformRecord?.key
      );
    }
    return platformUser;
  }

  async createPlatformUser(
    platformUserDto: PlatformUserDto,
    givenKey?: string
  ): Promise<PlatformUser> {
    const newUserKey = givenKey || randomBytes(64).toString('hex');
    return await this.userRepository.createPlatformUser({
      ...platformUserDto,
      key: newUserKey,
    });
  }

  async updatePlatformUser(
    { id }: { id: string },
    updatePayload: Prisma.PlatformUserUpdateInput
  ): Promise<PlatformUser> {
    const result = await this.userRepository.updatePlatformUser({
      where: { id },
      data: updatePayload,
    });

    return result;
  }
}
