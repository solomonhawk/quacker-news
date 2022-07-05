import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { Context } from 'server/context';

export const loggingMiddleware: MiddlewareFunction<Context, Context, unknown> = async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  result.ok
    ? console.log('OK request timing:', { path, type, durationMs })
    : console.error('Non-OK request timing', { path, type, durationMs });

  return result;
};
