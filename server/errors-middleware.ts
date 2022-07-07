import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { isUniqueConstraintViolation } from 'lib/prisma';
import { Context, Meta } from './context';

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const errorsMiddleware: MiddlewareFunction<Context, Context, Meta> = async ({ next, meta, ctx }) => {
  const result = await next({ ctx });

  if (!result.ok && result.error.cause instanceof Error) {
    const resourceName = meta?.resourceName || 'resource';
    const originalError = result.error.cause;

    // @NOTE: wrap not found errors
    // https://github.com/prisma/prisma/pull/14076
    // originalError instanceof Prisma.NotFoundError
    if (originalError?.name === 'NotFoundError') {
      result.error = new TRPCError({
        code: 'NOT_FOUND',
        message: `${capitalize(resourceName)} not found`,
        cause: originalError,
      });
    }
    // @NOTE: wrap unique constraint violation errors
    if (originalError instanceof Prisma.PrismaClientKnownRequestError && isUniqueConstraintViolation(originalError)) {
      result.error = new TRPCError({
        code: 'CONFLICT',
        message: `A ${meta?.resourceName || 'resource'} with this \`${originalError.meta.target[0]}\` already exists`,
        cause: originalError,
      });
    }
  }

  return result;
};
