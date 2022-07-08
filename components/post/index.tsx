import { PostFavoriteButton } from 'components/post-favorite-button';
import { PostHideButton } from 'components/post-hide-button';
import { PostUpvoteButton } from 'components/post-upvote-button';
import { Timestamp } from 'components/timestamp';
import { InferQueryOutput } from 'helpers/trpc';
import { host } from 'helpers/url';
import Link from 'next/link';
import { AddCommentForm } from '../add-comment-form';
import { Comment } from './comment';

type PostQueryById = NonNullable<InferQueryOutput<'post.byId'>>;

export const Post = ({ post }: { post: PostQueryById }) => {
  return (
    <div className="p-4">
      <div className="flex items-start mb-4">
        <PostUpvoteButton postId={post.id} disabled={false} upvoted={post.upvoted} />

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
      </div>

      {post.content && <pre className="mb-8 ml-5 font-sans">{post.content}</pre>}

      <div className="mb-8 ml-5">
        <AddCommentForm postId={post.id} submitButtonText="add comment" />
      </div>

      {post.comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </div>
  );
};
