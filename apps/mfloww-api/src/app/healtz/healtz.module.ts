import { Module } from '@nestjs/common';
import { HealtzController } from './healtz.controller';

@Module({
  controllers: [HealtzController],
})
export class HealtzModule {}
