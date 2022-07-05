import { PostUpvoteButton } from 'components/post-upvote-button';
import { ArrayElement, InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import PostTimestamp from './post-timestamp';

export const PostRow = ({ post }: { post: ArrayElement<InferQueryOutput<'post.all'>['posts']> }) => {
  return (
    <>
      <span className="opacity-60">{post.position}.</span>

      <PostUpvoteButton postId={post.id} disabled={false} upvoted={post.upvotes.length > 0} />

      <div className="flex flex-col ml-2">
        <div className="flex items-center">
          <Link href={post.url ?? `/item?id=${post.id}`} prefetch>
            <a className="text-lg">
              <h2>{post.title}</h2>
            </a>
          </Link>

          {post.url ? (
            <Link href={`/from?site=${host(post.url)}`}>
              <a className="ml-2 text-sm opacity-60 hover:underline">({host(post.url)})</a>
            </Link>
          ) : null}
        </div>

        <div className="text-xs opacity-60">
          {post._count.upvotes} point{post._count.upvotes === 1 ? '' : 's'} by{' '}
          <Link href={`/user?id=${post.author.id}`}>
            <a className="hover:underline">{post.author.username}</a>
          </Link>{' '}
          <PostTimestamp date={post.createdAt} /> | <button className="hover:underline">hide</button> |{' '}
          <Link href={`/item?id=${post.id}`} prefetch>
            <a className="hover:underline">
              {post._count.comments} comment{post._count.comments === 1 ? '' : 's'}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};