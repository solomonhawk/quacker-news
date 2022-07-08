import { trpc } from 'lib/trpc';
import cx from 'classnames';

export const CommentUpvoteButton = ({
  postId,
  commentId,
  disabled,
  upvoted,
  visible,
}: {
  postId: string;
  commentId: string;
  disabled: boolean;
  upvoted: boolean;
  visible: boolean;
}) => {
  const utils = trpc.useContext();

  const toggleUpvoteComment = trpc.useMutation(upvoted ? 'comment.upvote.delete' : 'comment.upvote.create', {
    onSuccess: () => {
      // @TODO(shawk) @PERF: this causes the entire post query to be re-executed
      // including re-fetching all comments, which is unnecessary
      utils.invalidateQueries(['post.byId', { id: postId }]);
      utils.invalidateQueries(['comment.byId', { id: commentId }]);
    },
  });

  const upvote = async () => {
    return toggleUpvoteComment.mutateAsync({ commentId });
  };

  return (
    <button
      onClick={upvote}
      disabled={disabled || toggleUpvoteComment.isLoading}
      className={cx({
        invisible: !visible,
        'opacity-40': !upvoted,
        'text-orange-500': upvoted,
      })}
    >
      ▲
    </button>
  );
};
