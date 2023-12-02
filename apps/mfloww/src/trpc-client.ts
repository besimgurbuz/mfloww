import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, TrpcClient } = createTrpcClient<AppRouter>({
  url: `${import.meta.env['VITE_TRPC_URL']}/api/trpc`,
});

export function injectTrpcClient() {
  return inject(TrpcClient);
}
