import { Prisma } from '@prisma/client';
import { createProtectedRouter } from 'server/create-router';
import { z } from 'zod';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  createdAt: true,
});

export const commentsRouter = createProtectedRouter()
  /**
   * @description Create comment
   */
  .mutation('create', {
    input: z.object({
      postId: z.string(),
      content: z.string(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.comment.create({
        data: { ...input, authorId: ctx.user.id },
        select: defaultCommentSelect,
      });
    },
  });
