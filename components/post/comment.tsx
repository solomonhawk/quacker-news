import { CommentUpvoteButton } from 'components/comment-upvote-button';
import { Timestamp } from 'components/posts-list/timestamp';
import { useLocalStorageState } from 'helpers/hooks/use-localstorage-state';
import Link from 'next/link';
import { PostCommentWithChildren } from 'server/domains/comments/helpers';

export const Comment = ({ comment }: { comment: PostCommentWithChildren }) => {
  const [expanded, setExpanded] = useLocalStorageState(['comment', comment.id, 'expanded'], true);

  return (
    <details id={comment.id} open={expanded} className="py-2">
      <summary className="flex cursor-pointer list-none items-center">
        <CommentUpvoteButton
          postId={comment.postId}
          commentId={comment.id}
          disabled={comment.authorId === 'a78b4628-c4cd-414f-8031-6d62a300ead3'}
          upvoted={comment.upvotes.length > 0}
          visible={expanded}
        />

        <span className="ml-2 text-sm opacity-60">
          {comment.author.username} <Timestamp date={comment.createdAt} />{' '}
          <button className="hover:underline" onClick={() => setExpanded(!expanded)}>
            {expanded ? '[-]' : `[${comment.childCount} more]`}
          </button>
        </span>
      </summary>

      {expanded ? (
        <div className="ml-7">
          <p>{comment.content}</p>

          <Link
            href={`/reply?id=${comment.id}&redirect=${encodeURIComponent(
              `item?id=${comment.postId}#${comment.postId}`,
            )}`}
          >
            <a className="text-xs underline">reply</a>
          </Link>
        </div>
      ) : null}

      <div className="ml-5">
        {comment.comments.map(reply => {
          return <Comment key={reply.id} comment={reply} />;
        })}
      </div>
    </details>
  );
};
