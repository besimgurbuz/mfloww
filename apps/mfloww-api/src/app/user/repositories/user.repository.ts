import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private static readonly logger = new ConsoleLogger(UserRepository.name);
}
