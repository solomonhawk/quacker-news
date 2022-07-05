import * as trpc from '@trpc/server';
import { Context } from './context';
import { authMiddleware } from './domains/auth/middleware';

export function createRouter() {
  return trpc.router<Context>();
}

export function createProtectedRouter() {
  return trpc.router<Context>().middleware(authMiddleware);
}
