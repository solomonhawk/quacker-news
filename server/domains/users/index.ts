import bcrypt from 'bcryptjs';
import { Context, Requestless } from 'server/context';
import { z } from 'zod';
import { createUserSchema, defaultUserSelect, userSelectAuthedProfile, userSelectPublicProfile } from './helpers';

export const karma = async (ctx: Requestless<Context>, username: string) => {
  const [postUpvoteCount, commentUpvoteCount] = await ctx.prisma.$transaction([
    ctx.prisma.postUpvote.count({
      where: {
        post: {
          author: { username },
        },
      },
    }),
    ctx.prisma.commentUpvote.count({
      where: {
        comment: {
          author: { username },
        },
      },
    }),
  ]);

  return postUpvoteCount + commentUpvoteCount;
};

export const byUsernamePublic = async (ctx: Requestless<Context>, username: string) => {
  const user = await ctx.prisma.user.findUnique({
    select: userSelectPublicProfile,
    where: {
      username,
    },
  });

  if (!user) {
    return null;
  }

  return { ...user, karma: await karma(ctx, username) };
};

export const byUsernamePrivate = async (ctx: Requestless<Context>, username: string) => {
  const user = await ctx.prisma.user.findUniqueOrThrow({
    select: userSelectAuthedProfile,
    where: {
      username,
    },
  });

  return { ...user, karma: await karma(ctx, username) };
};

export const byUsernameForAuth = async (ctx: Requestless<Context>, username: string) => {
  return ctx.prisma.user.findUniqueOrThrow({
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
