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
    input: paginationSchema,
    meta: {
      resourceName: 'post',
    },
    async resolve({ input: { page, perPage }, ctx }) {
      return posts.all(ctx, page, perPage);
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
       * @description Create a new post
       */
      .mutation('create', {
        input: createPostSchema,
        meta: {
          resourceName: 'post',
        },
        async resolve({ input, ctx }) {
          return ctx.prisma.post.create({ data: { ...input, authorId: ctx.session.user.id } });
        },
      }),
  );
