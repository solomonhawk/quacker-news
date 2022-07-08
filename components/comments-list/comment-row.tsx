import { CommentUpvoteButton } from 'components/comment-upvote-button';
import { ArrayElement } from 'helpers/trpc';
import Link from 'next/link';
import type { Comments } from '.';
import { Timestamp } from '../timestamp';

// @TW: bg-yellow-200 not-italic
export const CommentRow = ({ comment }: { comment: ArrayElement<Comments> }) => {
  return (
    <>
      <span className="opacity-60 font-mono mr-1">{comment.position}.</span>

      <CommentUpvoteButton
        postId={comment.postId}
        commentId={comment.id}
        disabled={false}
        upvoted={comment.upvoted}
        visible
      />

      <div className="flex flex-col ml-2">
        <div className="flex items-center">
          <a className="text-lg">
            <h2 className="leading-tight" dangerouslySetInnerHTML={{ __html: comment.content }} />
          </a>
        </div>

        <div className="text-xs opacity-60">
          {comment._count.upvotes} point{comment._count.upvotes === 1 ? '' : 's'} by{' '}
          <Link href={`/user?id=${comment.author.username}`}>
            <a className="hover:underline">{comment.author.username}</a>
          </Link>{' '}
          <Timestamp date={comment.createdAt} />
          {' | '}
          <Link href={`/item?id=${comment.id}`}>
            <a className="hover:underline">
              {comment._count.comments === 0
                ? 'discuss'
                : `${comment._count.comments} comment${comment._count.comments === 1 ? '' : 's'}`}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
