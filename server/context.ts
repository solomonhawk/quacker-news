import { inferAsyncReturnType } from '@trpc/server';
import { prisma } from 'lib/prisma';
import { getSession } from 'next-auth/react';
import * as trpcNext from '@trpc/server/adapters/next';
import { User } from 'next-auth';

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
  const session = await getSession({ req });

  return {
    user: session?.user,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type AuthedUserContext = Omit<Context, 'user'> & { user: User };
