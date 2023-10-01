import { router } from '../trpc';
import { authRoute } from './auth';
import { userRoute } from './user';

export const appRouter = router({
  user: userRoute,
  auth: authRoute,
});
// export type definition of API
export type AppRouter = typeof appRouter;
