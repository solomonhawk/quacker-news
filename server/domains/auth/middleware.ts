import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { AuthedUserContext, Context } from 'server/context';

export const authMiddleware: MiddlewareFunction<Context, AuthedUserContext, unknown> = async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
};
