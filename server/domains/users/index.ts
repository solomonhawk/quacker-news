import { Prisma } from '@prisma/client';
import { Context } from 'server/context';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
});

export const karma = async (ctx: Context) => {
  const [postUpvoteCount, commentUpvoteCount] = await ctx.prisma.$transaction([
    ctx.prisma.postUpvote.count({
      where: {
        post: {
          authorId: ctx.user?.id,
        },
      },
    }),
    ctx.prisma.commentUpvote.count({
      where: {
        comment: {
          authorId: ctx.user?.id,
        },
      },
    }),
  ]);

  return postUpvoteCount + commentUpvoteCount;
};

export const byUsername = async (ctx: Context, username: string) => {
  return await ctx.prisma.user.findUnique({
    where: {
      username,
    },
  });
};
