import { TRPCError } from '@trpc/server';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { prisma } from '../../prisma';
import { hashPassword } from '../../util';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { getKnownOrDefaultError, validateInputOrThrow } from './util';

export const userRoute = router({
  create: publicProcedure
    .input(
      validateInputOrThrow(
        z.object({
          username: z
            .string()
            .min(3, 'Errors.Validation.Min')
            .max(30, 'Errors.Validation.Max'),
          email: z.string().email({ message: 'Errors.Validation.Email' }),
          password: z
            .string()
            .min(5, 'Errors.Validation.Min')
            .max(50, 'Errors.Validation.Max'),
        })
      )
    )
    .output(z.boolean())
    .mutation(async ({ input }) => {
      const platformUser = await prisma.platformUser.findUnique({
        where: { email: input.email },
      });

      if (platformUser && input.username !== platformUser.username) {
        prisma.platformUser.update({
          where: { id: platformUser.id },
          data: { username: input.username },
        });
        return true;
      }

      const newUserKey = randomBytes(64).toString('hex');

      try {
        await prisma.user.create({
          data: {
            username: input.username,
            password: hashPassword(input.password, newUserKey),
            email: input.email,
            key: newUserKey,
          },
        });
        return true;
      } catch (error: any) {
        throw new TRPCError(getKnownOrDefaultError(error?.code));
      }
    }),
  update: protectedProcedure
    .input(
      validateInputOrThrow(
        z.object({
          email: z
            .string()
            .email({ message: 'Errors.Validation.Email' })
            .optional(),
          username: z
            .string()
            .min(3, 'Errors.Validation.Min')
            .max(30, 'Errors.Validation.Max')
            .optional(),
        })
      )
    )
    .output(
      z.object({
        id: z.string(),
        key: z.string(),
        username: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = ctx.user;
        const updatedUser = await prisma.user.update({
          where: {
            id,
          },
          data: input,
        });

        return {
          id: updatedUser.id,
          key: updatedUser.key,
          username: updatedUser.username,
          email: updatedUser.email,
        };
      } catch (error: any) {
        throw new TRPCError(getKnownOrDefaultError(error?.code));
      }
    }),
  updatePassword: protectedProcedure
    .input(
      validateInputOrThrow(
        z.object({
          currentPassword: z.string(),
          newPassword: z
            .string()
            .min(5, 'Errors.Validation.Min')
            .max(50, 'Errors.Validation.Max'),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, key, password } = ctx.user;

        if (password !== hashPassword(input.currentPassword, key)) {
          throw new TRPCError(getKnownOrDefaultError('PASSWORD_NOT_CORRECT'));
        }
        await prisma.user.update({
          where: { id },
          data: { password: input.newPassword },
        });
      } catch (err: any) {
        throw new TRPCError(getKnownOrDefaultError(err?.code));
      }
    }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { id } = ctx.user;
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new TRPCError(getKnownOrDefaultError('DELETE'));
    }
  }),
});
