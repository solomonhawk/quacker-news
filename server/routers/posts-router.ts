import { TRPCError } from '@trpc/server';
import { createRouter } from 'server/create-router';
import { paginationValidator } from 'server/domains/pagination';
import { z } from 'zod';
import * as posts from '../domains/posts';

export const postsRouter = createRouter()
  /**
   * @description Query all posts
   */
  .query('all', {
    input: paginationValidator,
    async resolve({ input: { page, perPage }, ctx }) {
      try {
        return await posts.all(page, perPage, ctx.user?.id);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
          cause: error,
        });
      }
    },
  })

  /**
   * @description Query post by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id }, ctx }) {
      try {
        return await posts.byId(id, ctx.user?.id);
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
          cause: error,
        });
      }
    },
  });
