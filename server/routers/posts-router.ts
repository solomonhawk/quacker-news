import { PostType } from '@prisma/client';
import { createProtectedRouter, createRouter } from 'server/create-router';
import { paginationSchema } from 'server/domains/pagination';
import * as posts from 'server/domains/posts';
import { createPostSchema } from 'server/domains/posts/helpers';
import { z } from 'zod';

export const postsRouter = createRouter()
  /**
   * @description Query all posts
   */
  .query('all', {
    input: z
      .object({ type: z.nativeEnum(PostType).optional() })
      .merge(paginationSchema)
      .default({}),
    meta: {
      resourceName: 'post',
    },
    resolve: async ({ input: { page, perPage, type }, ctx }) => posts.all(ctx, page, perPage, type),
  })

  /**
   * @description Query post by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    meta: {
      resourceName: 'post',
    },
    resolve: async ({ input: { id }, ctx }) => posts.byId(ctx, id),
  })

  .merge(
    createProtectedRouter()
      /**
       * @description Create a new post
       */
      .mutation('create', {
        input: createPostSchema,
        meta: {
          resourceName: 'post',
        },
        resolve: async ({ input, ctx }) => posts.create(ctx, input),
      }),
  );
