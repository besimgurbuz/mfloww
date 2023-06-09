import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ContributorsController } from './contributors.controller';
import { ContributorsService } from './contributors.service';

@Module({
  imports: [HttpModule],
  providers: [ContributorsService],
  controllers: [ContributorsController],
})
export class ContributorsModule {}
