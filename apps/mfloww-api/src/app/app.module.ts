import { Module } from '@nestjs/common';
import { AngularUniversalModule } from './angular-universal/angular-universal.module';

import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './core/prisma.service';
import { UserModule } from './user/user.module';
import { loadESModule } from './utils/load-esm-module';

@Module({
  imports: [
    AngularUniversalModule.forRoot(async () => {
      const angularModule = await loadESModule<{
        default: typeof import('../../../mfloww-web/src/main.server');
      }>(join(process.cwd(), 'dist/apps/mfloww-web/server/main.js'));

      return {
        bootstrap: angularModule.default.AppServerModule,
        ngExpressEngine: angularModule.default.ngExpressEngine,
        viewsPath: join(process.cwd(), 'dist/apps/mfloww-web/browser'),
      };
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
