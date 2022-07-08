import bcrypt from 'bcryptjs';
import { Context, Requestless } from 'server/context';
import { z } from 'zod';
import { createUserSchema, defaultUserSelect } from './helpers';

export const karma = async (ctx: Requestless<Context>) => {
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

export const byId = async (ctx: Requestless<Context>, id: string) => {
  return ctx.prisma.user.findUniqueOrThrow({
    where: { id },
    select: defaultUserSelect,
  });
};

export const byUsername = async (ctx: Requestless<Context>, username: string) => {
  return await ctx.prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const create = async (ctx: Context, { email, username, password }: z.infer<typeof createUserSchema>) => {
  return ctx.prisma.user.create({
    select: defaultUserSelect,
    data: {
      email,
      username,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
};
