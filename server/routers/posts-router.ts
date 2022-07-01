import * as trpc from '@trpc/server';
import { prisma } from 'lib/prisma';
import Trpc from 'pages/api/trpc/[trpc]';
import { z } from 'zod';

export const postsRouter = trpc
  .router()
  .query('all', {
    input: z
      .object({
        page: z.number().default(1),
        perPage: z.number().default(25),
      })
      .default({}),
    async resolve({ input: { page, perPage } }) {
      const skip = (page - 1) * perPage;

      const [totalCount, posts] = await prisma.$transaction([
        prisma.post.count(),
        prisma.post.findMany({
          skip,
          take: perPage,
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            url: true,
            _count: true,
          },
        }),
      ]);

      return {
        page,
        perPage,
        totalCount: totalCount,
        posts: posts.map((post, i) => {
          return {
            ...post,
            position: skip + i + 1,
          };
        }),
      };
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id } }) {
      try {
        return prisma.post.findUnique({
          where: { id },
          select: {
            id: true,
            title: true,
            content: true,
            url: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            createdAt: true,
            _count: true,
          },
          rejectOnNotFound: true,
        });
      } catch (error) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
          cause: error,
        });
      }
    },
  });
