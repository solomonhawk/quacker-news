import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import * as comments from '../domains/comments';
import { createRouter, createProtectedRouter } from 'server/create-router';
import { commentValidator } from 'server/domains/comments/helpers';
import * as z from 'zod';

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
    async resolve({ input: { id }, ctx }) {
      try {
        return await comments.byId(ctx, id);
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found',
          cause: error,
        });
      }
    },
  })
  .merge(
    createProtectedRouter()
      /**
       * @description Create comment
       */
      .mutation('create', {
        input: commentValidator,
        async resolve({ input, ctx }) {
          return ctx.prisma.comment.create({
            data: { ...input, authorId: ctx.session.user.id },
            select: defaultCommentSelect,
          });
        },
      }),
  );
