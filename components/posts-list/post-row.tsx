import { Post, Prisma } from '@prisma/client';
import { trpc } from 'lib/trpc';
import PostTimestamp from './post-timestamp';
import { host } from 'helpers/url';
import Link from 'next/link';
import { ArrayElement, InferQueryOutput } from 'helpers/trpc';

export const PostRow = ({ post }: { post: ArrayElement<InferQueryOutput<'post.all'>['posts']> }) => {
  const utils = trpc.useContext();

  const upvotePost = trpc.useMutation('post.upvote.create', {
    onSuccess: () => {
      utils.invalidateQueries(['post.all']);
    },
  });

  const upvote = async () => {
    await upvotePost.mutateAsync({
      postId: post.id,
      userId: '1219c445-41e5-489d-a842-5633e2c0e09a',
    });
  };

  return (
    <>
      <span>{post.position}.</span>

      <button className="ml-2 opacity-40" onClick={upvote}>
        ▲
      </button>

      <div className="flex flex-col ml-2">
        <div>
          <Link href={post.url ?? `/item?id=${post.id}`}>
            <a>{post.title}</a>
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
          <Link href={`/item?id=${post.id}`}>
            <a className="hover:underline">
              {post._count.comment} comment{post._count.comment === 1 ? '' : 's'}
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};
