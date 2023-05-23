import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('healtz')
export class HealtzController {
  @Get()
  @HttpCode(200)
  healtz() {
    return {
      message: 'Server is up and running',
    };
  }
}
