import { TRPCError } from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { AuthedUserContext, Context } from 'server/context';

export const authMiddleware: MiddlewareFunction<Context, AuthedUserContext, unknown> = async ({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { ...ctx, session: ctx.session } });
};
