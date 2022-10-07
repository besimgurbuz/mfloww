import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private static readonly logger = new ConsoleLogger(PrismaClient.name);

  async onModuleInit() {
    await this.$connect().then((promise) => {
      PrismaService.logger.debug('successfully connected to db');
      return promise;
    });
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
