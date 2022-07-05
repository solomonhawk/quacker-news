import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { createRouter } from 'server/create-router';
import { z } from 'zod';

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
});

export const usersRouter = createRouter()
  /**
   * @description Query user by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id }, ctx }) {
      const user = ctx.prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }

      return user;
    },
  });
