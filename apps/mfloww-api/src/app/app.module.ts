import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './core/prisma.service';
import { ExchangeModule } from './exchange/exchange.module';
import { HealtzModule } from './healtz/healtz.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    ExchangeModule,
    HealtzModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
