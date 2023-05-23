/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger as logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { PrismaService } from './app/core/prisma.service';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 8080;
  const globalPrefix = process.env.SERVER_PREFIX;
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  if (process.env.CORS_ORIGIN) {
    logger.log(`Enabling CORS for origin ${process.env.CORS_ORIGIN}`);
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Set-Cookie'],
      credentials: true,
    });
  }

  app.listen(port);
  logger.log(`Applications is up and running on port ${port}`);

  return app;
}

export default bootstrap();
