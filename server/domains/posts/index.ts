import { Context } from 'server/context';
import { commentWithAuthorAndUserUpvote } from '../comments';
import { threadComments } from '../comments/helpers';

export async function all(ctx: Context, page: number, perPage: number) {
  const skip = (page - 1) * perPage;

  const [totalCount, posts] = await ctx.prisma.$transaction([
    ctx.prisma.post.count(),
    ctx.prisma.post.findMany({
      skip,
      take: perPage,
      include: {
        _count: true,
        upvotes: {
          where: {
            userId: ctx.user?.id,
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

export async function byId(ctx: Context, id: string) {
  const post = await ctx.prisma.post.findUnique({
    rejectOnNotFound: true,
    where: { id },
    include: {
      _count: true,
      upvotes: {
        where: {
          userId: ctx.user?.id,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      comments: commentWithAuthorAndUserUpvote(ctx.user?.id),
    },
  });

  return {
    ...post,
    comments: threadComments(post.comments),
  };
}
