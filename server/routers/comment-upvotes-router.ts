import { createProtectedRouter } from 'server/create-router';
import { z } from 'zod';

export const commentUpvotesRouter = createProtectedRouter()
  /**
   * @description Create comment upvote
   */
  .mutation('create', {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.commentUpvote.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });
    },
  })

  /**
   * @description Delete comment upvote
   */
  .mutation('delete', {
    input: z.object({
      commentId: z.string(),
    }),
    async resolve({ input: { commentId }, ctx }) {
      return ctx.prisma.commentUpvote.delete({
        where: {
          commentId_userId: {
            userId: ctx.user.id,
            commentId,
          },
        },
      });
    },
  });
