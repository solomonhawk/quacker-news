import * as trpc from '@trpc/server';
import { AuthedUserContext, Context } from './context';

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return trpc.router<Context>().middleware<AuthedUserContext>(({ ctx, next }) => {
    if (!ctx.user) {
      throw new trpc.TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}
