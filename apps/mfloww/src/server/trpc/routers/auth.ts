import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const authRoute = router({
  logout: protectedProcedure.query(({ ctx }) => {
    ctx.setCookie('TOKEN', 'DELETED', { httpOnly: true, sameSite: 'Strict' });
  }),
  hasSession: protectedProcedure
    .output(
      z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().email(),
        key: z.string(),
      })
    )
    .query(({ ctx }) => {
      return ctx.user;
    }),
});
