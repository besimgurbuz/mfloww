import { inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../server/trpc/routers';

export type UserCreateInput = inferRouterInputs<AppRouter>['user']['create'];
