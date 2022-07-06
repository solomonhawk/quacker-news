import { Prisma } from '@prisma/client';
import { RequestlessContext } from 'server/context';

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  username: true,
});

export const karma = async (ctx: RequestlessContext) => {
  const [postUpvoteCount, commentUpvoteCount] = await ctx.prisma.$transaction([
    ctx.prisma.postUpvote.count({
      where: {
        post: {
          authorId: ctx.session?.user?.id,
        },
      },
    }),
    ctx.prisma.commentUpvote.count({
      where: {
        comment: {
          authorId: ctx.session?.user?.id,
        },
      },
    }),
  ]);

  return postUpvoteCount + commentUpvoteCount;
};

export const byUsername = async (ctx: RequestlessContext, username: string) => {
  return await ctx.prisma.user.findUnique({
    where: {
      username,
    },
  });
};
