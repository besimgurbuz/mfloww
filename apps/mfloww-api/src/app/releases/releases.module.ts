import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';

@Module({
  imports: [HttpModule],
  providers: [ReleasesService],
  controllers: [ReleasesController],
})
export class ReleasesModule {}
