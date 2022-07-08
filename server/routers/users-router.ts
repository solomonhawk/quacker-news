import { createProtectedRouter, createRouter } from 'server/create-router';
import * as users from 'server/domains/users';
import { createUserSchema } from 'server/domains/users/helpers';
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
    resolve: async ({ input: { id }, ctx }) => users.byId(ctx, id),
  })

  /**
   * @description Create a new user
   */
  .mutation('create', {
    input: createUserSchema,
    meta: {
      resourceName: 'user',
    },
    resolve: async ({ input, ctx }) => users.create(ctx, input),
  })

  .merge(
    createProtectedRouter()
      /**
       * @description Get the current user's karma count
       */
      .query('karma', {
        meta: {
          resourceName: 'user',
        },
        async resolve({ ctx }) {
          return users.karma(ctx);
        },
      }),
  );
