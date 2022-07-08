import type { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from 'lib/prisma';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

type ContextArgs =
  | trpcNext.CreateNextContextOptions
  | {
      req: GetServerSidePropsContext['req'];
      res: GetServerSidePropsContext['res'];
    };

export async function createContext({ req, res }: ContextArgs) {
  const session = await getSession({ req });

  return {
    req,
    res,
    session,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type Requestless<T> = Omit<T, 'req' | 'res'>;
export type AuthedContext = Omit<Context, 'session'> & { session: Session };

export type Meta = {
  resourceName?: string;
};
