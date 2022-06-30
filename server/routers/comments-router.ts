import { Prisma } from '@prisma/client';
import * as trpc from '@trpc/server';
import { prisma } from 'lib/prisma';
import { z } from 'zod';

const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  createdAt: true,
});

export const commentsRouter = trpc.router().mutation('create', {
  input: z.object({
    postId: z.string(),
    content: z.string(),
    authorId: z.string(),
  }),
  async resolve({ input }) {
    return prisma.comment.create({
      data: input,
      select: defaultCommentSelect,
    });
  },
});
