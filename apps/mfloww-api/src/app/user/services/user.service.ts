import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private static readonly logger = new ConsoleLogger(UserService.name);
}
