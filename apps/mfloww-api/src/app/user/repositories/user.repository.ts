import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
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
}
