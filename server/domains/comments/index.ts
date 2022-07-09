import { Prisma } from '@prisma/client';
import { AuthedContext, Context, Requestless } from 'server/context';
import { z } from 'zod';
import { selectOneForCurrentUser } from 'server/domains/helpers/filters';
import { highlightSearchTerm, OrderType } from 'server/domains/search/helpers';
import { createCommentSchema, defaultCommentSelect, threadComments } from './helpers';

export type PostComment = Prisma.CommentGetPayload<ReturnType<typeof commentWithAuthorAndUserUpvote>>;

export const commentWithAuthorAndUserUpvote = (userId?: string) => {
  return Prisma.validator<Prisma.CommentFindManyArgs>()({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      upvotes: selectOneForCurrentUser(userId),
      author: { select: { username: true } },
    },
  });
};

export async function byId(ctx: Requestless<Context>, id: string) {
  const [comment, comments] = await ctx.prisma.$transaction(async prisma => {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        post: {
          include: {
            author: {
              select: {
                username: true,
              },
            },
          },
        },
        ...commentWithAuthorAndUserUpvote(ctx.session?.user?.id).include,
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
      comments: threadComments(
        comments.map(comment => {
          return {
            ...comment,
            upvoted: ctx.session?.user?.id ? comment.upvotes.length > 0 : false,
          };
        }),
        comment.id,
      ),
    };
  }

  return null;
}

export async function search(
  ctx: Requestless<Context>,
  page: number,
  perPage: number,
  order: OrderType,
  query?: string,
) {
  const skip = (page - 1) * perPage;

  const where: Prisma.CommentWhereInput | undefined = query
    ? { content: { contains: query, mode: 'insensitive' } }
    : undefined;

  const orderBy =
    order === OrderType.DATE ? { createdAt: Prisma.SortOrder.desc } : { upvotes: { _count: Prisma.SortOrder.desc } };

  const [totalCount, comments] = await ctx.prisma.$transaction([
    ctx.prisma.comment.count({ where }),
    ctx.prisma.comment.findMany({
      skip: skip,
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
        post: {
          select: {
            title: true,
          },
        },
        upvotes: selectOneForCurrentUser(ctx.session?.user?.id),
      },
    }),
  ]);

  return {
    page,
    perPage,
    totalCount,
    totalPages: Math.ceil(totalCount / perPage),
    records: comments.map((comment, i) => {
      return {
        ...comment,
        content: highlightSearchTerm(comment.content, query),
        upvoted: ctx.session?.user?.id ? comment.upvotes.length > 0 : false,
        position: skip + i + 1,
      };
    }),
  };
}

export const create = async (ctx: Requestless<AuthedContext>, input: z.infer<typeof createCommentSchema>) => {
  return ctx.prisma.comment.create({
    data: { ...input, authorId: ctx.session.user.id },
    select: defaultCommentSelect,
  });
};
