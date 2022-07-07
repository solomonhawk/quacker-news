import { DefaultQueryCell } from 'components/default-query-cell';
import { PageTitle } from 'components/page-title';
import { Post } from 'components/post';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';

const ItemPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const postQuery = trpc.useQuery(['post.byId', { id }]);

  return (
    <>
      <Head>
        <title>QuackerNews - Loading...</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultQueryCell
        query={postQuery}
        success={({ data }) => {
          if (!data) {
            return (
              <>
                <PageTitle>{`QuackerNews - Post Not Found`}</PageTitle>
                <div>Post not found</div>
              </>
            );
          }

          return (
            <>
              <PageTitle>{`QuackerNews - ${data.title}`}</PageTitle>
              <Post post={data} />
            </>
          );
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async ctx => {
  const id = ctx.query.id as string;
  return dehydrateQueries(ctx, async ssg => await ssg.fetchQuery('post.byId', { id }), { id });
};

export default ItemPage;
