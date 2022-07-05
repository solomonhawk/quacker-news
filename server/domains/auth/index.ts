import * as trpc from '@trpc/server';
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { AuthedUserContext, Context, Meta } from 'server/context';

export const authMiddleware: MiddlewareFunction<Context, Context | AuthedUserContext, Meta> = async ({
  meta,
  next,
  ctx,
}) => {
  if (meta?.requiresAuth) {
    if (!ctx.user) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next<AuthedUserContext>({ ctx: { ...ctx, user: ctx.user } });
  }

  return next();
};
