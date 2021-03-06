import { PostFavoriteButton } from 'components/post-favorite-button';
import { PostHideButton } from 'components/post-hide-button';
import { PostUpvoteButton } from 'components/post-upvote-button';
import { ArrayElement, InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import { Timestamp } from '../timestamp';

export const PostRow = ({ post }: { post: ArrayElement<InferQueryOutput<'post.all'>['records']> }) => {
  return (
    <>
      <span className="opacity-60 font-mono mr-1">{post.position}.</span>

      <PostUpvoteButton postId={post.id} disabled={false} upvoted={post.upvoted} />

      <div className="flex flex-col ml-2">
        <div className="flex items-center">
          <Link href={post.url ?? `/item?id=${post.id}`}>
            <a className="text-lg">
              <h2 className="leading-tight" dangerouslySetInnerHTML={{ __html: post.title }} />
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
          <Link href={`/user?id=${post.author.username}`}>
            <a className="hover:underline">{post.author.username}</a>
          </Link>{' '}
          <Timestamp date={post.createdAt} />
          {' | '}
          <PostHideButton postId={post.id} hidden={post.hidden} />
          {' | '}
          <PostFavoriteButton postId={post.id} favorited={post.favorited} />
          {' | '}
          <Link href={`/item?id=${post.id}`}>
            <a className="hover:underline">
              {post._count.comments === 0
                ? 'discuss'
                : `${post._count.comments} comment${post._count.comments === 1 ? '' : 's'}`}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
