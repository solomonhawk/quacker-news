import { PostType } from '@prisma/client';
import { AuthedContext, Context, Requestless } from 'server/context';
import { z } from 'zod';
import { commentWithAuthorAndUserUpvote } from '../comments';
import { threadComments } from '../comments/helpers';
import { createPostSchema, derivePostType } from './helpers';

export async function all(ctx: Requestless<Context>, page: number, perPage: number, type?: PostType) {
  const skip = (page - 1) * perPage;

  const [totalCount, posts] = await ctx.prisma.$transaction([
    ctx.prisma.post.count({
      where: {
        type,
        hiddenPosts: {
          none: {
            userId: ctx.session?.user?.id,
          },
        },
      },
    }),
    ctx.prisma.post.findMany({
      skip,
      take: perPage,
      where: {
        type,
        hiddenPosts: {
          none: {
            userId: ctx.session?.user?.id,
          },
        },
      },
      include: {
        _count: true,
        upvotes: {
          take: ctx.session?.user?.id ? 1 : 0,
          where: {
            userId: ctx.session?.user?.id,
          },
          select: {
            id: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        hiddenPosts: {
          take: ctx.session?.user?.id ? 1 : 0,
          where: {
            userId: ctx.session?.user?.id,
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
        hidden: ctx.session?.user?.id ? post.hiddenPosts.length > 0 : false,
        upvoted: ctx.session?.user?.id ? post.upvotes.length > 0 : false,
        position: skip + i + 1,
      };
    }),
  };
}

export async function byId(ctx: Requestless<Context>, id: string) {
  const post = await ctx.prisma.post.findUnique({
    where: { id },
    include: {
      _count: true,
      upvotes: {
        take: ctx.session?.user?.id ? 1 : 0,
        where: {
          userId: ctx.session?.user?.id,
        },
        select: {
          id: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      hiddenPosts: {
        take: ctx.session?.user?.id ? 1 : 0,
        where: {
          userId: ctx.session?.user?.id,
        },
      },
      comments: commentWithAuthorAndUserUpvote(ctx.session?.user?.id),
    },
  });

  if (!post) {
    return null;
  }

  return {
    ...post,
    hidden: ctx.session?.user?.id ? post.hiddenPosts.length > 0 : false,
    upvoted: ctx.session?.user?.id ? post.upvotes.length > 0 : false,
    comments: threadComments(post.comments).map(comment => {
      if (ctx.session?.user?.id) {
        return {
          ...comment,
          upvoted: comment.upvotes.length > 0,
        };
      }

      return comment;
    }),
  };
}

export async function hidden(ctx: Requestless<Context>, page: number, perPage: number) {
  const skip = (page - 1) * perPage;

  const [totalCount, posts] = await ctx.prisma.$transaction([
    ctx.prisma.post.count({
      where: {
        hiddenPosts: {
          some: {
            userId: ctx.session?.user?.id,
          },
        },
      },
    }),
    ctx.prisma.post.findMany({
      skip,
      take: perPage,
      where: {
        hiddenPosts: {
          some: {
            userId: ctx.session?.user?.id,
          },
        },
      },
      include: {
        _count: true,
        upvotes: {
          take: ctx.session?.user?.id ? 1 : 0,
          where: {
            userId: ctx.session?.user?.id,
          },
          select: {
            id: true,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        hiddenPosts: {
          take: ctx.session?.user?.id ? 1 : 0,
          where: {
            userId: ctx.session?.user?.id,
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
        hidden: ctx.session?.user?.id ? post.hiddenPosts.length > 0 : false,
        upvoted: ctx.session?.user?.id ? post.upvotes.length > 0 : false,
        position: skip + i + 1,
      };
    }),
  };
}

export const create = async (ctx: Requestless<AuthedContext>, input: z.infer<typeof createPostSchema>) => {
  return ctx.prisma.post.create({
    data: { ...input, type: derivePostType(input.title, input.url), authorId: ctx.session.user.id },
  });
};

export const hide = async (ctx: Requestless<AuthedContext>, id: string) => {
  return ctx.prisma.hiddenPost.create({
    data: { postId: id, userId: ctx.session.user.id },
  });
};

export const unhide = async (ctx: Requestless<AuthedContext>, postId: string) => {
  return ctx.prisma.hiddenPost.delete({
    where: {
      userId_postId: {
        postId,
        userId: ctx.session.user.id,
      },
    },
  });
};
