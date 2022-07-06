import { PostUpvoteButton } from 'components/post-upvote-button';
import { ArrayElement, InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import { Timestamp } from './timestamp';

export const PostRow = ({ post }: { post: ArrayElement<InferQueryOutput<'post.all'>['posts']> }) => {
  return (
    <>
      <span className="opacity-60 font-mono">{post.position}.</span>

      <PostUpvoteButton postId={post.id} disabled={false} upvoted={post.upvoted} />

      <div className="flex flex-col ml-2">
        <div className="flex items-center">
          <Link href={post.url ?? `/item?id=${post.id}`}>
            <a className="text-lg">
              <h2 className="leading-tight">{post.title}</h2>
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
          <Timestamp date={post.createdAt} /> | <button className="hover:underline">hide</button> |{' '}
          <Link href={`/item?id=${post.id}`}>
            <a className="hover:underline">
              {post._count.comments} comment
              {post._count.comments === 1 ? '' : 's'}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
