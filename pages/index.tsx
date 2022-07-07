import { DefaultQueryCell } from 'components/default-query-cell';
import { PostsList } from 'components/posts-list';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';

const IndexPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ page }) => {
  const postsQuery = trpc.useQuery(['post.all', { page }]);

  return (
    <>
      <Head>
        <title>QuackerNews</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultQueryCell
        query={postsQuery}
        isEmpty={({ data }) => data.totalCount === 0}
        empty={() => <div>There are no posts yet - go ahead and add one!</div>}
        success={({ data }) => {
          return (
            <PostsList
              posts={data.posts}
              nextPageUrl={page * data.perPage < data.totalCount ? `/news?p=${page + 1}` : undefined}
            />
          );
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const pageParam = parseInt(ctx.query.page as string, 10);
  const page = isNaN(pageParam) ? 1 : pageParam;
  return dehydrateQueries(ctx, async ssg => await ssg.fetchQuery('post.all', { page }), { page });
};

export default IndexPage;
