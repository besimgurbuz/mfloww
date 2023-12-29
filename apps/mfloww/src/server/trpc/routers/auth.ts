import { User } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { randomBytes, randomInt } from 'crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const authRoute = router({
  loginAnonymously: publicProcedure
    .output(
      z.object({
        id: z.string(),
        key: z.string(),
        username: z.string(),
        isAnonymous: z.boolean(),
      })
    )
    .mutation(({ ctx }) => {
      if (ctx.user) {
        throw new TRPCClientError(
          'A user already signed in, cannot continue as anonymous'
        );
      }
      const anonymousUser = {
        id: randomInt(9999).toString(),
        key: randomBytes(64).toString('hex'),
        username: 'anonymous',
        isAnonymous: true,
      };

      const anonymousToken = jwt.sign(
        anonymousUser,
        process.env['JWT_SECRET'] as string
      );
      ctx.setCookie('TOKEN', anonymousToken, {
        httpOnly: true,
        sameSite: 'Strict',
      });
      return anonymousUser;
    }),
  logout: protectedProcedure.query(({ ctx }) => {
    ctx.setCookie('TOKEN', 'DELETED', { httpOnly: true, sameSite: 'Strict' });
  }),
  hasSession: protectedProcedure
    .output(
      z
        .object({
          id: z.string(),
          username: z.string(),
          email: z.string().email(),
          key: z.string(),
        })
        .or(
          z.object({
            id: z.string(),
            key: z.string(),
            username: z.string(),
            isAnonymous: z.boolean(),
          })
        )
    )
    .query(({ ctx }) => {
      return ctx.user as
        | User
        | { id: string; key: string; username: string; isAnonymous: boolean };
    }),
});
