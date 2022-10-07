import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './core/prisma.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
