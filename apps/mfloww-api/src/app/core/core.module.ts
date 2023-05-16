import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaService, HttpModule],
  providers: [PrismaService],
  imports: [HttpModule],
})
export class CoreModule {}
