import { CommentUpvoteButton } from 'components/comment-upvote-button';
import { Timestamp } from 'components/timestamp';
import { useLocalStorageState } from 'helpers/hooks/use-localstorage-state';
import Link from 'next/link';
import { PostCommentWithChildren } from 'server/domains/comments/helpers';

export const Comment = ({ comment }: { comment: PostCommentWithChildren }) => {
  const [expanded, setExpanded] = useLocalStorageState(['comment', comment.id, 'expanded'], true);

  return (
    <div id={comment.id} className="py-2">
      <div className="flex items-center">
        <CommentUpvoteButton
          postId={comment.postId}
          commentId={comment.id}
          disabled={comment.authorId === 'a78b4628-c4cd-414f-8031-6d62a300ead3'}
          upvoted={comment.upvoted}
          visible={expanded}
        />

        <span className="ml-2 text-sm opacity-60">
          <Link href={`/user?id=${comment.author.username}`}>
            <a className="hover:underline">{comment.author.username}</a>
          </Link>{' '}
          <Link href={`/comment?id=${comment.id}`}>
            <a className="hover:underline">
              <Timestamp date={comment.createdAt} />
            </a>
          </Link>{' '}
          <button className="hover:underline" onClick={() => setExpanded(!expanded)}>
            {expanded ? '[-]' : `[${comment.childCount} more]`}
          </button>
        </span>
      </div>

      {expanded ? (
        <div className="ml-5">
          <p>{comment.content}</p>

          <Link
            href={`/reply?id=${comment.id}&redirect=${encodeURIComponent(
              `item?id=${comment.postId}#${comment.postId}`,
            )}`}
          >
            <a className="text-xs underline">reply</a>
          </Link>

          <div className="ml-5">
            {comment.comments.map(reply => {
              return <Comment key={reply.id} comment={reply} />;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
