import { trpc } from 'lib/trpc';
import cx from 'classnames';

export const PostUpvoteButton = ({
  postId,
  disabled,
  upvoted,
}: {
  postId: string;
  disabled: boolean;
  upvoted: boolean;
}) => {
  const utils = trpc.useContext();

  const toggleUpvotePost = trpc.useMutation(upvoted ? 'post.upvote.delete' : 'post.upvote.create', {
    onSuccess: () => {
      // @TODO(shawk) @PERF: this will cause all posts to get re-fetched, which
      // isn't great - can we do better? react-query does not have built-in
      // support for a normalized cache so we'd have to get clever and build
      // something on top
      utils.invalidateQueries(['post.all']);
      utils.invalidateQueries(['post.byId', { id: postId }]);
    },
  });

  const upvote = async () => {
    return toggleUpvotePost.mutateAsync({ postId });
  };

  return (
    <button
      onClick={upvote}
      disabled={disabled || toggleUpvotePost.isLoading}
      className={cx({
        'opacity-40': !upvoted,
        'text-orange-500': upvoted,
      })}
    >
      ▲
    </button>
  );
};
