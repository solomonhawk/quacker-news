import PostTimestamp from 'components/posts-list/post-timestamp';
import { InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import { trpc } from 'lib/trpc';
import Link from 'next/link';

type PostQueryById = InferQueryOutput<'post.byId'>;

export const Post = ({ post }: { post: PostQueryById }) => {
  const utils = trpc.useContext();

  const upvotePost = trpc.useMutation('post.upvote.create', {
    onSuccess: () => {
      utils.invalidateQueries(['post.byId', { id: post.id }]);
    },
  });

  const upvote = async () => {
    await upvotePost.mutateAsync({
      postId: post.id,
      userId: '1219c445-41e5-489d-a842-5633e2c0e09a',
    });
  };

  return (
    <div className="bg-[#f6f6ef] flex items-start p-2">
      <button className="ml-2 opacity-40" onClick={upvote}>
        ▲
      </button>

      <div className="flex flex-col ml-2">
        <div>
          {post.url ? (
            <Link href={post.url}>
              <a>{post.title}</a>
            </Link>
          ) : (
            <h1>{post.title}</h1>
          )}

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
    </div>
  );
};
