import { DefaultQueryCell } from 'components/default-query-cell';
import { PageTitle } from 'components/page-title';
import { PrivateUserProfile } from 'components/user/private-profile';
import { PublicUserProfile } from 'components/user/public-profile';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

const UserPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ username }) => {
  const { data: session } = useSession();
  const isCurrentUser = username === session?.user?.username;

  const publicUserQuery = trpc.useQuery(['user.byUsername.public', { username }], { enabled: !isCurrentUser });
  const privateUserQuery = trpc.useQuery(['user.byUsername.private', { username }], { enabled: isCurrentUser });

  return (
    <>
      <Head>
        <title>QuackerNews - Loading...</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isCurrentUser && (
        <DefaultQueryCell
          query={publicUserQuery}
          success={({ data }) => {
            if (!data) {
              return (
                <>
                  <PageTitle>{`QuackerNews - User Not Found`}</PageTitle>
                  <div>User not found</div>
                </>
              );
            }

            return (
              <>
                <PageTitle>{`QuackerNews - ${data.username}`}</PageTitle>
                <PublicUserProfile user={data} />
              </>
            );
          }}
        />
      )}

      {isCurrentUser && (
        <DefaultQueryCell
          query={privateUserQuery}
          success={({ data }) => {
            return (
              <>
                <PageTitle>{`QuackerNews - ${data.username}`}</PageTitle>
                <PrivateUserProfile user={data} />
              </>
            );
          }}
        />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ username: string }> = async ctx => {
  const username = ctx.query.id as string;

  return dehydrateQueries(
    ctx,
    async (ssg, session) => {
      const isCurrentUser = username === session?.user?.username;

      return isCurrentUser
        ? await ssg.fetchQuery('user.byUsername.private', { username })
        : await ssg.fetchQuery('user.byUsername.public', { username });
    },
    { username },
  );
};

export default UserPage;
