import { createTrpcClient } from '@analogjs/trpc';
import { inject } from '@angular/core';
import { AppRouter } from './server/trpc/routers';

export const { provideTrpcClient, TrpcClient } = createTrpcClient<AppRouter>({
  url: `${import.meta.env['VITE_ANALOG_PUBLIC_BASE_URL']}/api/trpc`,
});

export function injectTrpcClient() {
  return inject(TrpcClient);
}
