import { TRPCError } from '@trpc/server';
import { ZodError, ZodSchema } from 'zod';

export function validateInputOrThrow<T>(
  schema: ZodSchema<T>
): (input: unknown) => T {
  return (input: unknown) => {
    try {
      return schema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: JSON.stringify({
            ...firstError,
            name: firstError.path[0],
          }),
        });
      }
      throw error;
    }
  };
}

const userRouteKnownErrors = {
  P2002: { code: 'BAD_REQUEST', message: 'Errors.NonUniqueEmail' },
  P2025: { code: 'BAD_REQUEST', message: 'Errors.UserNotFound' },
  PASSWORD_NOT_CORRECT: {
    code: 'BAD_REQUEST',
    message: 'Errors.PasswordNotCorrect',
  },
  DELETE: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Errors.UserDeletionFailed',
  },
  LOGIN_FAILED: {
    code: 'BAD_REQUEST',
    message: 'Errors.LoginFailed',
  },
  DEFAULT: { code: 'INTERNAL_SERVER_ERROR', message: 'Errors.ServerFailed' },
} as const;

export function getKnownOrDefaultError(
  code: keyof typeof userRouteKnownErrors
) {
  return userRouteKnownErrors[code] || userRouteKnownErrors['DEFAULT'];
}
