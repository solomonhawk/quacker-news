import { createProtectedRouter } from 'server/create-router';
import { z } from 'zod';

export const postUpvotesRouter = createProtectedRouter()
  /**
   * @description Create post upvote
   */
  .mutation('create', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.postUpvote.create({
        data: { ...input, userId: ctx.user.id },
      });
    },
  })

  /**
   * @description Delete post upvote
   */
  .mutation('delete', {
    input: z.object({
      postId: z.string(),
    }),
    async resolve({ input: { postId }, ctx }) {
      return ctx.prisma.postUpvote.delete({
        where: {
          userId_postId: {
            userId: ctx.user.id,
            postId,
          },
        },
      });
    },
  });
