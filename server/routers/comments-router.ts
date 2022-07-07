import { Prisma } from '@prisma/client';
import { createProtectedRouter, createRouter } from 'server/create-router';
import { createCommentSchema } from 'server/domains/comments/helpers';
import * as z from 'zod';
import * as comments from '../domains/comments';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  createdAt: true,
});

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
    async resolve({ input: { id }, ctx }) {
      return comments.byId(ctx, id);
    },
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
        async resolve({ input, ctx }) {
          return ctx.prisma.comment.create({
            data: { ...input, authorId: ctx.session.user.id },
            select: defaultCommentSelect,
          });
        },
      }),
  );
