import { Prisma } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { threadComments } from './helpers';

const commentWithAuthorAndUserUpvote = (userId?: string) => {
  return Prisma.validator<Prisma.CommentArgs>()({
    include: { upvotes: { where: { userId } }, author: { select: { username: true } } },
  });
};

export type PostComment = Prisma.CommentGetPayload<ReturnType<typeof commentWithAuthorAndUserUpvote>>;

export async function all(page: number, perPage: number, userId?: string) {
  const skip = (page - 1) * perPage;

  const [totalCount, posts] = await prisma.$transaction([
    prisma.post.count(),
    prisma.post.findMany({
      skip,
      take: perPage,
      include: {
        _count: true,
        upvotes: {
          where: {
            userId,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),
  ]);

  return {
    page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    posts: posts.map((post, i) => {
      return {
        ...post,
        position: skip + i + 1,
      };
    }),
  };
}

export async function byId(id: string, userId?: string) {
  const post = await prisma.post.findUnique({
    rejectOnNotFound: true,
    where: { id },
    include: {
      _count: true,
      upvotes: {
        where: {
          userId,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      comments: commentWithAuthorAndUserUpvote(userId),
    },
  });

  return {
    ...post,
    comments: threadComments(post.comments),
  };
}
