import { CommentUpvoteButton } from 'components/comment-upvote-button';
import { AddCommentForm } from 'components/add-comment-form';
import { Comment } from 'components/post/comment';
import { Timestamp } from 'components/posts-list/timestamp';
import { InferQueryOutput } from 'helpers/trpc';
import Link from 'next/link';

type Props = {
  comment: NonNullable<InferQueryOutput<'comment.byId'>>;
};

export const CommentReply = ({ comment }: Props) => {
  return (
    <div className="bg-[#f6f6ef] p-2">
      <div className="flex flex-col ml-2 mb-4">
        <div className="flex items-start mb-2 text-sm">
          <CommentUpvoteButton
            postId={comment.postId}
            commentId={comment.id}
            disabled={comment.authorId === 'a78b4628-c4cd-414f-8031-6d62a300ead3'}
            upvoted={comment.upvotes.length > 0}
            visible
          />

          <div className="ml-2 flex items-center gap-1 opacity-60">
            <Link href={`/user?id=${comment.authorId}`}>
              <a className="hover:underline">{comment.author.username}</a>
            </Link>
            <Link href={comment.parentId ? `/reply?id=${comment.parentId}` : `/item?id=${comment.postId}`}>
              <a className="hover:underline">
                <Timestamp date={comment.createdAt} />{' '}
              </a>
            </Link>
            {' | '}
            <Link href={comment.parentId ? `/reply?id=${comment.parentId}` : `/item?id=${comment.postId}`}>
              <a className="hover:underline">parent</a>
            </Link>{' '}
            {' | '}
            <Link href={`/item?id=${comment.postId}#${comment.parentId}`}>
              <a className="hover:underline">context</a>
            </Link>{' '}
            {' | '}
            <span>
              on:{' '}
              <Link href={`/item?id=${comment.postId}`}>
                <a className="hover:underline">{comment.post.title}</a>
              </Link>
            </span>
          </div>
        </div>

        <div className="ml-7">
          <p>{comment.content}</p>
        </div>
      </div>

      <div className="mb-8 ml-7">
        <AddCommentForm postId={comment.postId} parentId={comment.id} submitButtonText="reply" />
      </div>

      {comment.comments.map(reply => {
        return <Comment key={reply.id} comment={reply} />;
      })}
    </div>
  );
};
