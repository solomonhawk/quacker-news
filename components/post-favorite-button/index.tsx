import { trpc } from 'lib/trpc';

export const PostFavoriteButton = ({ postId, favorited }: { postId: string; favorited: boolean }) => {
  const utils = trpc.useContext();

  const toggleFavorite = trpc.useMutation(favorited ? 'post.unfavorite' : 'post.favorite', {
    onSuccess: () => {
      utils.invalidateQueries('post.all');
      utils.invalidateQueries('post.hidden');
      utils.invalidateQueries('post.favorites');
      utils.invalidateQueries(['post.byId', { id: postId }]);
    },
  });

  const hide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return toggleFavorite.mutateAsync({ id: postId });
  };

  return (
    <button disabled={toggleFavorite.isLoading} className="hover:underline" onClick={hide}>
      {favorited ? 'un-favorite' : 'favorite'}
    </button>
  );
};
