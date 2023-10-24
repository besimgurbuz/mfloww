import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';
import { validateInputOrThrow } from '../util';
import { exchangeRates } from './exchange-rates';
import { SUPPORTED_CURRENCIES } from './supported-currency';

const exchangeRateProvider = exchangeRates();

export const exchangeRateRoute = router({
  latest: protectedProcedure
    .input(
      validateInputOrThrow(
        z.object({
          baseCurrency: z.enum(SUPPORTED_CURRENCIES),
        })
      )
    )
    .output(
      z.object({
        base: z.enum(SUPPORTED_CURRENCIES),
        rates: z.record(z.enum(SUPPORTED_CURRENCIES), z.number()),
        remaining: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await exchangeRateProvider(input.baseCurrency);
    }),
});
