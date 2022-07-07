import * as trpc from '@trpc/server';
import { Context, Meta } from './context';
import { authMiddleware } from './domains/auth/middleware';

export function createRouter() {
  return trpc.router<Context, Meta>();
}

export function createProtectedRouter() {
  return trpc.router<Context, Meta>().middleware(authMiddleware);
}
