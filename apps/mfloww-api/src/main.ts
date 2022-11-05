/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { PrismaService } from './app/core/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  Logger.log(`Enabling CORS for origin ${process.env.CORS_ORIGIN}`);
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Set-Cookie'],
    credentials: true,
  });
  const port = process.env.PORT || 3333;
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );

  return app;
}

export default bootstrap();
