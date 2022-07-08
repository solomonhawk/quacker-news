import type { PostComment } from '../comments';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const createCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().optional(),
  content: z
    .string({ required_error: 'Comment is required' })
    .min(16, 'Your comment is too short, please enter at least 16 characters')
    .max(1024, 'Your comment is too long, please keep it under 1024 characters'),
});

export const defaultCommentSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  createdAt: true,
});

export type PostCommentWithChildren = PostComment & {
  comments: PostCommentWithChildren[];
  childCount: number;
  upvoted: boolean;
};

const countChildren = (comments: PostCommentWithChildren[]): number => {
  return comments.length + comments.reduce((acc, comment) => acc + countChildren(comment.comments), 0);
};

export function threadComments(comments: PostComment[], rootId?: string): PostCommentWithChildren[] {
  const byId: Record<string, PostCommentWithChildren> = {};

  // @TODO(shawk) @PERF: it would be nice not to have to iterate this list
  // of comments more than once. we could fix it with some extra branching
  // and clever ordering of operations

  // initialize entries
  for (const comment of comments) {
    byId[comment.id] = { ...comment, comments: [], childCount: 0, upvoted: false };
  }

  // nest comments under their parents
  for (const comment of comments) {
    if (comment.parentId && byId[comment.parentId]) {
      byId[comment.parentId].comments.push(byId[comment.id]);
    }
  }

  // count comment children (recursively)
  for (const comment of comments) {
    byId[comment.id].childCount = 1 + countChildren(byId[comment.id].comments);
  }

  return comments
    .filter(comment => {
      return comment.parentId === (rootId || null);
    })
    .map(comment => byId[comment.id]);
}
