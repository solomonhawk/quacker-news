import * as trpc from '@trpc/server';
import { prisma } from 'lib/prisma';
import { z } from 'zod';

export const postUpvotesRouter = trpc.router().mutation('create', {
  input: z.object({
    postId: z.string(),
    userId: z.string(),
  }),
  async resolve({ input }) {
    return prisma.postUpvote.create({
      data: input,
    });
  },
});
