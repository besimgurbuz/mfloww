import { router } from '../trpc';
import { authRoute } from './auth';
import { exchangeRateRoute } from './exchange-rates';
import { userRoute } from './user';

export const appRouter = router({
  user: userRoute,
  auth: authRoute,
  exchangeRate: exchangeRateRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
