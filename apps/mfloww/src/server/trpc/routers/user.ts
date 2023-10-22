import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../../prisma';
import { protectedProcedure, router } from '../trpc';
import { getKnownOrDefaultError, validateInputOrThrow } from './util';

export const userRoute = router({
  update: protectedProcedure
    .input(
      validateInputOrThrow(
        z.object({
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
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const { id } = ctx.user;
      await prisma.user.delete({ where: { id } });
    } catch (err) {
      throw new TRPCError(getKnownOrDefaultError('DELETE'));
    }
  }),
});
