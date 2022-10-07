import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
