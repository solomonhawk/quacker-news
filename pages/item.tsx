import { DefaultQueryCell } from 'components/default-query-cell';
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
          const pageTitle = `QuackerNews - ${data.title}`;
          return (
            <>
              <Head>
                <title>{pageTitle}</title>
              </Head>
              <Post post={data} />
            </>
          );
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  id: string;
}> = async ctx => {
  const id = ctx.query.id as string;

  const dataProps = await dehydrateQueries(ctx, async ssg => {
    await ssg.fetchQuery('post.byId', { id });
  });

  return { props: { ...dataProps, id } };
};

export default ItemPage;
