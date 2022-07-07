import { DefaultQueryCell } from 'components/default-query-cell';
import { trpc } from 'lib/trpc';
import { useSession } from 'next-auth/react';

export const UserKarma = () => {
  const { data: session, status } = useSession();

  const karmaQuery = trpc.useQuery(['user.karma'], {
    enabled: status === 'authenticated',
    staleTime: 5 * 1000, // 5 seconds
    refetchOnWindowFocus: true,
  });

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <DefaultQueryCell
      query={karmaQuery}
      loading={() => <span>(..)</span>}
      success={({ data }) => <span>({data ?? session.user.karma})</span>}
    />
  );
};
