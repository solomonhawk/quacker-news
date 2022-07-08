import { createProtectedRouter, createRouter } from 'server/create-router';
import * as users from 'server/domains/users';
import { createUserSchema } from 'server/domains/users/helpers';
import { z } from 'zod';

export const usersRouter = createRouter()
  /**
   * @description Query public user by ID
   */
  .query('byUsername.public', {
    input: z.object({
      username: z.string(),
    }),
    meta: {
      resourceName: 'user',
    },
    resolve: async ({ input: { username }, ctx }) => users.byUsernamePublic(ctx, username),
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
        input: z.object({
          username: z.string(),
        }),
        meta: {
          resourceName: 'user',
        },
        async resolve({ input: { username }, ctx }) {
          return users.karma(ctx, username);
        },
      })

      /**
       * @description Query user by ID
       */
      .query('byUsername.private', {
        input: z.object({
          username: z.string(),
        }),
        meta: {
          resourceName: 'user',
        },
        resolve: async ({ input: { username }, ctx }) => users.byUsernamePrivate(ctx, username),
      }),
  );
