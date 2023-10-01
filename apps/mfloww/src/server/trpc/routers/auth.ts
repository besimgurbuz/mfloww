import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { env } from 'process';
import { z } from 'zod';
import { prisma } from '../../prisma';
import { hashPassword } from '../../util';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { getKnownOrDefaultError, validateInputOrThrow } from './util';

export const authRoute = router({
  login: publicProcedure
    .input(
      validateInputOrThrow(
        z.object({
          email: z.string().email({ message: 'Errors.Validation.Email' }),
          password: z.string(),
        })
      )
    )
    .output(
      z.object({
        id: z.string(),
        username: z.string(),
        email: z.string().email(),
        key: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: { email: input.email },
        });

        if (!user || hashPassword(input.password, user.key) !== user.password) {
          throw new TRPCError(getKnownOrDefaultError('P2025'));
        }
        const tokenPayload = {
          id: user.id,
          username: user.username,
          email: user.email,
          key: user.key,
        };
        const token = jwt.sign(tokenPayload, env['JWT_SECRET'] as string);

        ctx.setCookie('TOKEN', token, { httpOnly: true, sameSite: 'Strict' });
        return tokenPayload;
      } catch (err: any) {
        throw new TRPCError(getKnownOrDefaultError('LOGIN_FAILED'));
      }
    }),
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
