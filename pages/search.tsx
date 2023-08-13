import { CommentsList } from 'components/comments-list';
import { DefaultQueryCell } from 'components/default-query-cell';
import { PostsList } from 'components/posts-list';
import { PostRowSimple } from 'components/posts-list/post-row-simple';
import { SearchPageForm } from 'components/search-page-form';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import qs from 'query-string';
import { OrderType, searchQuerySchema, SearchType } from 'server/domains/search/helpers';

const SearchPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ params }) => {
  const { page, query, type, order } = params;
  const searchQuery = trpc.useQuery(['search.query', params]);

  return (
    <>
      <Head>
        <title>QuackerNews - Search</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchPageForm searchTerm={query} type={type} order={order}>
        <DefaultQueryCell
          query={searchQuery}
          loading={() => (
            <div className="p-4">
              <em>Loading...</em>
            </div>
          )}
          isEmpty={({ data }) => data.results.totalCount === 0}
          empty={() => <div className="p-4">No results found</div>}
          success={({ data }) => {
            const nextPageUrl =
              data.results.page * data.results.perPage < data.results.totalCount
                ? `/search?${qs.stringify({ ...params, page: page + 1 })}`
                : undefined;

            switch (data.type) {
              case SearchType.POST: {
                return (
                  <PostsList posts={data.results.records} nextPageUrl={nextPageUrl} PostRowComponent={PostRowSimple} />
                );
              }

              case SearchType.COMMENT: {
                return <CommentsList comments={data.results.records} nextPageUrl={nextPageUrl} />;
              }
            }
          }}
        />
      </SearchPageForm>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  params: {
    page: number;
    perPage: number;
    query?: string;
    type?: SearchType;
    order?: OrderType;
  };
}> = async ctx => {
  const params = searchQuerySchema.parse({
    page: ctx.query.page,
    type: ctx.query.type,
    query: ctx.query.q,
    order: ctx.query.order,
  });

  return dehydrateQueries(ctx, async ssg => await ssg.fetchQuery('search.query', params), { params });
};

export default SearchPage;