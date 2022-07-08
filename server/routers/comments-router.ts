import { createProtectedRouter, createRouter } from 'server/create-router';
import { createCommentSchema } from 'server/domains/comments/helpers';
import { z } from 'zod';
import * as comments from '../domains/comments';

export const commentsRouter = createRouter()
  /**
   * @description Get comment by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    meta: {
      resourceName: 'comment',
    },
    resolve: async ({ input: { id }, ctx }) => comments.byId(ctx, id),
  })
  .merge(
    createProtectedRouter()
      /**
       * @description Create comment
       */
      .mutation('create', {
        input: createCommentSchema,
        meta: {
          resourceName: 'comment',
        },
        resolve: async ({ input, ctx }) => comments.create(ctx, input),
      }),
  );
