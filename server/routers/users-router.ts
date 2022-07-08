import bcrypt from 'bcryptjs';
import { createProtectedRouter, createRouter } from 'server/create-router';
import * as users from 'server/domains/users';
import { defaultUserSelect } from 'server/domains/users';
import { z } from 'zod';

export const usersRouter = createRouter()
  /**
   * @description Query user by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    meta: {
      resourceName: 'user',
    },
    async resolve({ input: { id }, ctx }) {
      return ctx.prisma.user.findUniqueOrThrow({
        where: { id },
        select: defaultUserSelect,
      });
    },
  })

  /**
   * @description Create a new user
   */
  .mutation('create', {
    input: z.object({
      email: z.string(),
      username: z.string(),
      password: z.string(),
    }),
    meta: {
      resourceName: 'user',
    },
    async resolve({ input: { email, username, password }, ctx }) {
      return ctx.prisma.user.create({
        data: {
          email,
          username,
          passwordHash: await bcrypt.hash(password, 10),
        },
        select: defaultUserSelect,
      });
    },
  })

  /**
   * @description Get the current user's karma count
   */
  .merge(
    createProtectedRouter().query('karma', {
      meta: {
        resourceName: 'user',
      },
      async resolve({ ctx }) {
        return users.karma(ctx);
      },
    }),
  );
