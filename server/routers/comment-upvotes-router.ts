import { Prisma } from '@prisma/client';
import * as trpc from '@trpc/server';
import { prisma } from 'lib/prisma';
import { z } from 'zod';

export const commentUpvotesRouter = trpc.router().mutation('create', {
  input: z.object({
    commentId: z.string(),
    userId: z.string(),
  }),
  async resolve({ input }) {
    return prisma.commentUpvote.create({
      data: input,
    });
  },
});
