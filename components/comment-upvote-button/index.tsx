import { trpc } from 'lib/trpc';
import cx from 'classnames';
import { SearchType } from 'server/domains/search/helpers';

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
      utils.invalidateQueries(['search.query', { type: SearchType.COMMENT }]);
    },
  });

  const upvote = async () => {
    return toggleUpvoteComment.mutateAsync({ commentId });
  };

  return (
    <button
      onClick={upvote}
      disabled={disabled || toggleUpvoteComment.isLoading}
      className={cx('leading-none', {
        invisible: !visible,
        'opacity-40': !upvoted,
        'text-orange-500': upvoted,
      })}
    >
      ▲
    </button>
  );
};
