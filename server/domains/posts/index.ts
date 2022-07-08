import { RequestlessContext } from 'server/context';
import { commentWithAuthorAndUserUpvote } from '../comments';
import { threadComments } from '../comments/helpers';

export async function all(ctx: RequestlessContext, page: number, perPage: number) {
  const skip = (page - 1) * perPage;

  const [totalCount, posts] = await ctx.prisma.$transaction([
    ctx.prisma.post.count(),
    ctx.prisma.post.findMany({
      skip,
      take: perPage,
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
      comments: commentWithAuthorAndUserUpvote(ctx.session?.user?.id),
    },
  });

  if (!post) {
    return null;
  }

  return {
    ...post,
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
