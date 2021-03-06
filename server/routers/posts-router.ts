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
    async resolve({ input: { page, perPage, type }, ctx }) {
      return posts.all(ctx, page, perPage, type);
    },
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
    async resolve({ input: { id }, ctx }) {
      return posts.byId(ctx, id);
    },
  })

  .merge(
    createProtectedRouter()
      /**
       * @description Query user's hidden posts
       */
      .query('hidden', {
        input: paginationSchema.default({}),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { page, perPage }, ctx }) {
          return posts.hidden(ctx, page, perPage);
        },
      })

      /**
       * @description Query user's favorite posts
       */
      .query('favorites', {
        input: paginationSchema.default({}),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { page, perPage }, ctx }) {
          return posts.favorites(ctx, page, perPage);
        },
      })

      /**
       * @description Create a new post
       */
      .mutation('create', {
        input: createPostSchema,
        meta: {
          resourceName: 'post',
        },
        async resolve({ input, ctx }) {
          return posts.create(ctx, input);
        },
      })

      /**
       * @description Hide a post
       */
      .mutation('hide', {
        input: z.object({
          id: z.string(),
        }),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { id }, ctx }) {
          return posts.hide(ctx, id);
        },
      })

      /**
       * @description Unhide a post
       */
      .mutation('unhide', {
        input: z.object({
          id: z.string(),
        }),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { id }, ctx }) {
          return posts.unhide(ctx, id);
        },
      })

      /**
       * @description Favorite a post
       */
      .mutation('favorite', {
        input: z.object({
          id: z.string(),
        }),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { id }, ctx }) {
          return posts.favorite(ctx, id);
        },
      })

      /**
       * @description Unfavorite a post
       */
      .mutation('unfavorite', {
        input: z.object({
          id: z.string(),
        }),
        meta: {
          resourceName: 'post',
        },
        async resolve({ input: { id }, ctx }) {
          return posts.unfavorite(ctx, id);
        },
      }),
  );
