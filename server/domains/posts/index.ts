import { PostType, Prisma, PrismaClient } from '@prisma/client';
import { AuthedContext, Context, Requestless } from 'server/context';
import { z } from 'zod';
import { commentWithAuthorAndUserUpvote } from '../comments';
import { threadComments } from '../comments/helpers';
import { selectOneForCurrentUser } from '../helpers/filters';
import { highlightSearchTerm, OrderType } from '../search/helpers';
import { createPostSchema, derivePostType } from './helpers';

type Pagination = {
  page: number;
  skip: number;
  perPage: number;
};

type PaginatedPostsQueryParams = {
  prisma: PrismaClient;
  pagination: Pagination;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationAndSearchRelevanceInput;
  userId?: string;
  query?: string;
};

const queryPaginatedPosts = async ({
  prisma,
  pagination: { page, skip, perPage },
  where,
  orderBy,
  userId,
  query,
}: PaginatedPostsQueryParams) => {
  const [totalCount, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      include: {
        _count: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        upvotes: selectOneForCurrentUser(userId),
        favorites: selectOneForCurrentUser(userId),
        hiddenPosts: selectOneForCurrentUser(userId),
      },
    }),
  ]);

  return {
    page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    records: posts.map((post, i) => {
      return {
        ...post,
        title: highlightSearchTerm(post.title, query),
        content: post.content ? highlightSearchTerm(post.content, query) : null,
        favorited: userId ? post.favorites.length > 0 : false,
        hidden: userId ? post.hiddenPosts.length > 0 : false,
        upvoted: userId ? post.upvotes.length > 0 : false,
        position: skip + i + 1,
      };
    }),
  };
};

export async function all(ctx: Requestless<Context>, page: number, perPage: number, type?: PostType) {
  const pagination = {
    page,
    skip: (page - 1) * perPage,
    perPage,
  };

  const where = {
    type,
    hiddenPosts: {
      none: {
        userId: ctx.session?.user?.id,
      },
    },
  };

  const orderBy = {
    upvotes: {
      _count: Prisma.SortOrder.desc,
    },
  };

  return queryPaginatedPosts({ prisma: ctx.prisma, pagination, where, orderBy, userId: ctx.session?.user.id });
}

export async function search(
  ctx: Requestless<Context>,
  page: number,
  perPage: number,
  order: OrderType,
  query?: string,
) {
  const pagination = {
    page,
    skip: (page - 1) * perPage,
    perPage,
  };

  const where: Prisma.PostWhereInput | undefined = query
    ? {
        OR: [
          { title: { search: query, mode: 'insensitive' } },
          { title: { contains: query, mode: 'insensitive' } },
          { content: { search: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const orderBy =
    order === OrderType.DATE ? { createdAt: Prisma.SortOrder.desc } : { upvotes: { _count: Prisma.SortOrder.desc } };

  return queryPaginatedPosts({ prisma: ctx.prisma, pagination, where, orderBy, userId: ctx.session?.user.id, query });
}

export async function byId(ctx: Requestless<Context>, id: string) {
  const post = await ctx.prisma.post.findUnique({
    where: { id },
    include: {
      _count: true,
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      upvotes: selectOneForCurrentUser(ctx.session?.user?.id),
      favorites: selectOneForCurrentUser(ctx.session?.user?.id),
      hiddenPosts: selectOneForCurrentUser(ctx.session?.user?.id),
      comments: commentWithAuthorAndUserUpvote(ctx.session?.user?.id),
    },
  });

  if (!post) {
    return null;
  }

  return {
    ...post,
    favorited: ctx.session?.user?.id ? post.favorites.length > 0 : false,
    hidden: ctx.session?.user?.id ? post.hiddenPosts.length > 0 : false,
    upvoted: ctx.session?.user?.id ? post.upvotes.length > 0 : false,
    comments: threadComments(
      post.comments.map(comment => {
        return {
          ...comment,
          upvoted: ctx.session?.user?.id ? comment.upvotes.length > 0 : false,
        };
      }),
    ),
  };
}

export async function hidden(ctx: Requestless<Context>, page: number, perPage: number) {
  const pagination = {
    page,
    skip: (page - 1) * perPage,
    perPage,
  };

  const where = {
    hiddenPosts: {
      some: {
        userId: ctx.session?.user?.id,
      },
    },
  };

  return queryPaginatedPosts({ prisma: ctx.prisma, pagination, where, userId: ctx.session?.user.id });
}

export async function favorites(ctx: Requestless<Context>, page: number, perPage: number) {
  const pagination = {
    page,
    skip: (page - 1) * perPage,
    perPage,
  };

  const where = {
    favorites: {
      some: {
        userId: ctx.session?.user?.id,
      },
    },
  };

  return queryPaginatedPosts({ prisma: ctx.prisma, pagination, where, userId: ctx.session?.user.id });
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

export const favorite = async (ctx: Requestless<AuthedContext>, id: string) => {
  return ctx.prisma.favorite.create({
    data: { postId: id, userId: ctx.session.user.id },
  });
};

export const unfavorite = async (ctx: Requestless<AuthedContext>, postId: string) => {
  return ctx.prisma.favorite.delete({
    where: {
      userId_postId: {
        postId,
        userId: ctx.session.user.id,
      },
    },
  });
};
