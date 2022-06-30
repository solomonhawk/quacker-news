import { Prisma } from '@prisma/client';
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { prisma } from 'lib/prisma';
import { z } from 'zod';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
});

export const usersRouter = trpc.router().query('byId', {
  input: z.object({
    id: z.string(),
  }),
  async resolve({ input: { id } }) {
    const user = prisma.user.findUnique({
      where: { id },
      select: defaultUserSelect,
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No post with id '${id}'`,
      });
    }
    return user;
  },
});
