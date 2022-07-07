import { Prisma } from '@prisma/client';
import { RequestlessContext } from 'server/context';
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

export async function byId(ctx: RequestlessContext, id: string) {
  const [comment, comments] = await ctx.prisma.$transaction(async prisma => {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
          },
        },
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
            userId: ctx.session?.user?.id,
          },
        },
      },
    });

    // @NOTE: sadge... can't pull back all nested posts easily with the comment
    // query above since replies of replies aren't associated to the comment
    // being queried.
    const comments = comment
      ? await prisma.comment.findMany({
          where: { postId: comment.postId },
          ...commentWithAuthorAndUserUpvote(ctx.session?.user?.id),
        })
      : [];

    return [comment, comments] as const;
  });

  if (comment) {
    return {
      ...comment,
      comments: threadComments(comments, comment.id),
    };
  }

  return null;
}
