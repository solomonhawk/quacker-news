import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { prisma } from 'lib/prisma';

type User = { id: string };

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions): Promise<{ prisma: typeof prisma; user?: User }> {
  // Create your context based on the request object
  // Will be available as `ctx` in all your resolvers

  // This is just an example of something you'd might want to do in your ctx fn
  // async function getUserFromHeader() {
  //   if (req.headers.authorization) {
  //     const user = await decodeAndVerifyJwtToken(req.headers.authorization.split(' ')[1])
  //     return user;
  //   }
  //   return null;
  // }
  // const user = await getUserFromHeader();

  return {
    prisma,
    user: {
      id: '30d88f08-8786-4023-9428-350c4e2a0848',
    },
  };
}

export type Meta = { requiresAuth?: boolean };
export type Context = inferAsyncReturnType<typeof createContext>;
export type AuthedUserContext = Required<Context>;
