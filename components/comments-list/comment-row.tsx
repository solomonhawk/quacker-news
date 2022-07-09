import { ArrayElement } from 'helpers/trpc';
import Link from 'next/link';
import type { Comments } from '.';
import { Timestamp } from '../timestamp';

// @TW: bg-yellow-300 font-bold not-italic
export const CommentRow = ({ comment }: { comment: ArrayElement<Comments> }) => {
  return (
    <div className="flex flex-col ml-2">
      <div className="text-xs opacity-60">
        {comment._count.upvotes} point{comment._count.upvotes === 1 ? '' : 's'} by{' '}
        <Link href={`/user?id=${comment.author.username}`}>
          <a className="hover:underline">{comment.author.username}</a>
        </Link>{' '}
        {' | '}
        <Timestamp date={comment.createdAt} />
        {' | '}
        <Link href={comment.parentId ? `/comment?id=${comment.parentId}` : `/item?id=${comment.postId}`}>
          <a className="hover:underline">parent</a>
        </Link>
        {' | '}
        <Link href={`/item?id=${comment.postId}#${comment.id}`}>
          <a className="hover:underline">
            {comment._count.comments === 0
              ? 'discuss'
              : `${comment._count.comments} comment${comment._count.comments === 1 ? '' : 's'}`}
          </a>
        </Link>
        {' on: '}
        <Link href={`/item?id=${comment.postId}`}>
          <a className="hover:underline">{comment.post.title}</a>
        </Link>
      </div>

      <div className="flex items-center">
        <Link href={`/comment?id=${comment.id}`}>
          <a className="text-lg leading-tight">
            <h2 dangerouslySetInnerHTML={{ __html: comment.content }} />
          </a>
        </Link>
      </div>
    </div>
  );
};
