import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PlatformUser, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core/prisma.service';

@Injectable()
export class UserRepository {
  private static readonly logger = new ConsoleLogger(UserRepository.name);

  constructor(private prisma: PrismaService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    UserRepository.logger.debug(
      `user queried with: { email: ${userWhereUniqueInput.email} }`
    );
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    UserRepository.logger.debug(
      `a new User creation requested with: { username: ${data.username}, email: ${data.email} }`
    );
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    UserRepository.logger.debug(
      `saved user update requested for:  { email: ${data.email} }`
    );
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    UserRepository.logger.debug(
      `delete user requested for: { email: ${where.email} }`
    );
    return this.prisma.user.delete({
      where,
    });
  }

  async getPlatformUser(
    platformUserWhereUniqueInput: Prisma.PlatformUserWhereUniqueInput
  ): Promise<PlatformUser | null> {
    UserRepository.logger.debug(
      `PlatformUser queried with: { email: ${platformUserWhereUniqueInput.email} }`
    );
    return this.prisma.platformUser.findUnique({
      where: platformUserWhereUniqueInput,
    });
  }

  async createPlatformUser(
    data: Prisma.PlatformUserCreateInput
  ): Promise<PlatformUser> {
    const isEmailAlreadSaved = await this.getUser({ email: data.email });
    if (isEmailAlreadSaved) {
      throw new Error('User already created.');
    }
    UserRepository.logger.debug(
      `a new PlatformUser creation requested with {email: ${data.email} platform: ${data.platform} }`
    );
    return this.prisma.platformUser.create({
      data,
    });
  }

  async updatePlatformUser(params: {
    where: Prisma.PlatformUserWhereUniqueInput;
    data: Prisma.PlatformUserUpdateInput;
  }): Promise<PlatformUser> {
    const { where, data } = params;
    if (data.email) delete data.email;
    UserRepository.logger.debug(
      `saved PlatformUser update requested for:  { email: ${data.email} }`
    );
    return this.prisma.platformUser.update({
      data,
      where,
    });
  }

  async deletePlatformUser(
    where: Prisma.PlatformUserWhereUniqueInput
  ): Promise<PlatformUser> {
    UserRepository.logger.debug(
      `delete PlatformUser requested for { email: ${where.email}}`
    );
    return this.prisma.platformUser.delete({
      where,
    });
  }
}
