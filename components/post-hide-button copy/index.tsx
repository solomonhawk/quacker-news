import { trpc } from 'lib/trpc';

export const PostHideButton = ({ postId, hidden }: { postId: string; hidden: boolean }) => {
  const utils = trpc.useContext();

  const toggleHidden = trpc.useMutation(hidden ? 'post.unhide' : 'post.hide', {
    onSuccess: () => {
      utils.invalidateQueries('post.all');
      utils.invalidateQueries('post.hidden');
      utils.invalidateQueries(['post.byId', { id: postId }]);
    },
  });

  const hide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return toggleHidden.mutateAsync({ id: postId });
  };

  return (
    <button disabled={toggleHidden.isLoading} className="hover:underline" onClick={hide}>
      {hidden ? 'un-hide' : 'hide'}
    </button>
  );
};
