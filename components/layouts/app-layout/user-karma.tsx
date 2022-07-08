import { DefaultQueryCell } from 'components/default-query-cell';
import { trpc } from 'lib/trpc';
import { useSession } from 'next-auth/react';

export const UserKarma = () => {
  const { data: session, status } = useSession();

  if (status !== 'authenticated') {
    return null;
  }

  const karmaQuery = trpc.useQuery(['user.karma', { username: session.user.username }], {
    enabled: status === 'authenticated',
    staleTime: 5 * 1000, // 5 seconds
    refetchOnWindowFocus: true,
  });

  return (
    <DefaultQueryCell
      query={karmaQuery}
      loading={() => <span>(..)</span>}
      success={({ data }) => <span>({data ?? session.user.karma})</span>}
    />
  );
};
