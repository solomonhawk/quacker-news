import type { PostComment } from '.';

export type PostCommentWithChildren = PostComment & {
  comments: PostCommentWithChildren[];
  childCount: number;
};

const countChildren = (comments: PostCommentWithChildren[]): number => {
  return comments.length + comments.reduce((acc, comment) => acc + countChildren(comment.comments), 0);
};

export function threadComments(comments: PostComment[]): PostCommentWithChildren[] {
  const byId: Record<string, PostCommentWithChildren> = {};

  // @TODO(shawk) @PERF: it would be nice not to have to iterate this list
  // of comments more than once. we could fix it with some extra branching
  for (const comment of comments) {
    byId[comment.id] = { ...comment, comments: [], childCount: 1 };
  }

  for (const comment of comments) {
    if (comment.parentId) {
      byId[comment.parentId].comments.push(byId[comment.id]);
      byId[comment.parentId].childCount += 1;
    }
  }

  return comments
    .filter(comment => comment.parentId === null)
    .map(comment => {
      return byId[comment.id];
    });
}
