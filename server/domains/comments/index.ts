import { Prisma } from '@prisma/client';
import { AuthedContext, Context, Requestless } from 'server/context';
import { z } from 'zod';
import { createCommentSchema, defaultCommentSelect, threadComments } from './helpers';

export type PostComment = Prisma.CommentGetPayload<ReturnType<typeof commentWithAuthorAndUserUpvote>>;

export const commentWithAuthorAndUserUpvote = (userId?: string) => {
  return Prisma.validator<Prisma.CommentFindManyArgs>()({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      upvotes: { take: userId ? 1 : 0, where: { userId } },
      author: { select: { username: true } },
    },
  });
};

export async function byId(ctx: Requestless<Context>, id: string) {
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

export const create = async (ctx: Requestless<AuthedContext>, input: z.infer<typeof createCommentSchema>) => {
  return ctx.prisma.comment.create({
    data: { ...input, authorId: ctx.session.user.id },
    select: defaultCommentSelect,
  });
};
