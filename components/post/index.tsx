import { PostUpvoteButton } from 'components/post-upvote-button';
import PostTimestamp from 'components/posts-list/post-timestamp';
import { InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import { Comment } from './comment';

type PostQueryById = InferQueryOutput<'post.byId'>;

export const Post = ({ post }: { post: PostQueryById }) => {
  return (
    <div className="bg-[#f6f6ef] p-2">
      <div className="flex items-start mb-4">
        <PostUpvoteButton postId={post.id} disabled={false} upvoted={post.upvotes.length > 0} />

        <div className="flex flex-col ml-2">
          <div className="flex items-center">
            {post.url ? (
              <Link href={post.url}>
                <a className="text-lg">
                  <h1>{post.title}</h1>
                </a>
              </Link>
            ) : (
              <h1 className="text-lg">{post.title}</h1>
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
                {post._count.comments} comment{post._count.comments === 1 ? '' : 's'}
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8 ml-7">
        <form>
          <textarea className="block w-[90%] border border-gray-700 rounded text-lg p-2 mb-2" rows={8} cols={80} />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 active:bg-gray-100 rounded border border-gray-700 px-2 font-mono"
          >
            add comment
          </button>
        </form>
      </div>

      {post.comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
};
