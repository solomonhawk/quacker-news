import { ArrayElement, InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import { Timestamp } from '../timestamp';

export const PostRowSimple = ({ post }: { post: ArrayElement<InferQueryOutput<'post.all'>['records']> }) => {
  return (
    <>
      <div className="flex flex-col ml-2">
        <div className="flex items-center">
          <Link href={`/item?id=${post.id}`}>
            <a className="text-lg">
              <h2 className="leading-tight" dangerouslySetInnerHTML={{ __html: post.title }} />
            </a>
          </Link>

          {post.url && (
            <Link href={`/from?site=${host(post.url)}`}>
              <a className="ml-2 text-sm opacity-60 hover:underline">({post.url})</a>
            </Link>
          )}
        </div>

        <div className="text-xs opacity-60">
          {post._count.upvotes} point{post._count.upvotes === 1 ? '' : 's'}
          {' | '}
          <Link href={`/user?id=${post.author.username}`}>
            <a className="hover:underline">{post.author.username}</a>
          </Link>{' '}
          {' | '}
          <Timestamp date={post.createdAt} />
          {' | '}
          <Link href={`/item?id=${post.id}`}>
            <a className="hover:underline">
              {`${post._count.comments} comment${post._count.comments === 1 ? '' : 's'}`}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
