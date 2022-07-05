import { CommentUpvoteButton } from 'components/comment-upvote-button';
import PostTimestamp from 'components/posts-list/post-timestamp';
import { useLocalStorageState } from 'helpers/hooks/use-localstorage-state';
import Link from 'next/link';
import { PostCommentWithChildren } from 'server/domains/posts/helpers';

const countChildren = (comments: PostCommentWithChildren[]): number => {
  return comments.length + comments.reduce((acc, comment) => acc + countChildren(comment.comments), 0);
};

export const Comment = ({ comment, depth = 0 }: { comment: PostCommentWithChildren; depth?: number }) => {
  const [expanded, setExpanded] = useLocalStorageState(['comment', comment.id, 'expanded'], true);

  return (
    <details open={expanded} style={{ marginLeft: depth * 12 }} className="py-2">
      <summary className="flex cursor-pointer list-none items-center">
        <CommentUpvoteButton
          postId={comment.postId}
          commentId={comment.id}
          disabled={comment.authorId === '30d88f08-8786-4023-9428-350c4e2a0848'}
          upvoted={comment.upvotes.length > 0}
          visible={expanded}
        />

        <div className="ml-2">
          <div className="text-sm opacity-60">
            {comment.author.username} <PostTimestamp date={comment.createdAt} />{' '}
            <button className="hover:underline" onClick={() => setExpanded(!expanded)}>
              {expanded ? '[-]' : `[${comment.childCount} more]`}
            </button>
          </div>
        </div>
      </summary>

      {expanded ? (
        <div className="ml-7">
          <p>{comment.content}</p>

          <Link href="/#todo">
            <a className="text-xs underline">reply</a>
          </Link>
        </div>
      ) : null}

      {comment.comments.map(reply => {
        return <Comment key={reply.id} comment={reply} depth={depth + 1} />;
      })}
    </details>
  );
};
