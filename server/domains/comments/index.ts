import { Prisma } from '@prisma/client';
import { Context } from 'server/context';
import { threadComments } from './helpers';

export const commentWithAuthorAndUserUpvote = (userId?: string) => {
  return Prisma.validator<Prisma.CommentFindManyArgs>()({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      upvotes: { where: { userId } },
      author: { select: { username: true } },
    },
  });
};

export type PostComment = Prisma.CommentGetPayload<ReturnType<typeof commentWithAuthorAndUserUpvote>>;

export async function byId(ctx: Context, id: string) {
  const [comment, comments] = await ctx.prisma.$transaction(async prisma => {
    const comment = await prisma.comment.findUnique({
      rejectOnNotFound: true,
      where: { id },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        parent: true,
        post: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
        upvotes: {
          where: {
            userId: ctx.user?.id,
          },
        },
      },
    });

    // @NOTE: sadge... can't pull back all nested posts easily with the comment
    // query above since replies of replies aren't associated to the comment
    // being queried.
    const comments = await prisma.comment.findMany({
      where: { postId: comment.postId },
      ...commentWithAuthorAndUserUpvote(ctx.user?.id),
    });

    return [comment, comments] as const;
  });

  return {
    ...comment,
    comments: threadComments(comments, comment.id),
  };
}
