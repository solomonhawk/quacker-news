import { Post } from 'components/post';
import { trpc } from 'lib/trpc';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { appRouter } from 'server/router';
import superjson from 'superjson';
import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { prisma } from 'lib/prisma';

const ItemPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const postQuery = trpc.useQuery(['post.byId', { id }]);

  if (postQuery.isLoading && !postQuery.data) {
    return <div>Loading...</div>;
  }

  if (postQuery.isError || !postQuery.data) {
    return <div>Something went wrong...</div>;
  }

  const pageTitle = `QuackerNews - ${postQuery.data.title}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Post post={postQuery.data} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async ctx => {
  const id = ctx.query.id as string;

  try {
    const ssg = await createSSGHelpers({
      router: appRouter,
      // @TODO(shawk): get user id from session
      ctx: { prisma, user: { id: '30d88f08-8786-4023-9428-350c4e2a0848' } },
      transformer: superjson,
    });

    await ssg.fetchQuery('post.byId', { id });

    return { props: { trpcState: ssg.dehydrate(), id } };
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'NOT_FOUND') {
        return {
          notFound: true,
        };
      }
    }

    throw error;
  }
};

export default ItemPage;
