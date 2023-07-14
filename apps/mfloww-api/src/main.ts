import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { PrismaService } from './app/core/prisma.service';
import { MockLocalStorage } from './app/utils/mock-local-storage';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  const port = process.env.PORT || 3333;
  const prismaService = app.get(PrismaService);
  Logger.log('===ENV===');
  Logger.log(
    `DATABSE_URL: ${process.env.DATABASE_URL} JWT_SECRET: ${process.env.JWT_SECRET} PORT: ${process.env.PORT} CORS_ORIGIN: ${process.env.CORS_ORIGIN} ENABLE_USER_CREATION: ${process.env.ENABLE_USER_CREATION}`
  );
  Logger.log('===ENV===');

  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  // browser polyfills
  global['window'] = {} as any;
  global['localStorage'] = new MockLocalStorage();

  if (process.env.CORS_ORIGIN) {
    Logger.log(`Enabling CORS for origin ${process.env.CORS_ORIGIN}`);
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Set-Cookie'],
      credentials: true,
    });
  }

  await prismaService.enableShutdownHooks(app);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  return app;
}

export default bootstrap();
