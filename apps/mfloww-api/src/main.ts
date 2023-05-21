/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { PrismaService } from './app/core/prisma.service';
import { environment } from './environments/environment';

async function bootstrap() {
  Logger.log('===ENV===');
  Logger.log(
    `DATABSE_URL: ${process.env.DATABASE_URL} JWT_SECRET: ${process.env.JWT_SECRET} PORT: ${process.env.PORT} CORS_ORIGIN: ${process.env.CORS_ORIGIN} ENABLE_USER_CREATION: ${process.env.ENABLE_USER_CREATION}`
  );
  Logger.log('===ENV===');
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  if (process.env.CORS_ORIGIN) {
    Logger.log(`Enabling CORS for origin ${process.env.CORS_ORIGIN}`);
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Set-Cookie'],
      credentials: true,
    });
  }
  const port = process.env.PORT || 3333;
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(port);
  if (!environment.production) {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  }

  return app;
}

export default bootstrap();
