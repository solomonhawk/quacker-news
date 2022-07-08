import { CommentReply } from 'components/comment-reply';
import { DefaultQueryCell } from 'components/default-query-cell';
import { ReplyLayout } from 'components/layouts/reply-layout';
import { PageTitle } from 'components/page-title';
import { ServerSideDataProps } from 'helpers/trpc';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { NextPageWithLayout } from './_app';

const ReplyPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const commentQuery = trpc.useQuery(['comment.byId', { id }]);

  return (
    <>
      <Head>
        <title>QuackerNews - Loading...</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DefaultQueryCell
        query={commentQuery}
        error={({ error }) => <div>{error.message}</div>}
        success={({ data }) => {
          if (!data) {
            return (
              <>
                <PageTitle>{`QuackerNews - Comment Not Found`}</PageTitle>
                <div>Comment not found</div>
              </>
            );
          }

          return (
            <>
              <PageTitle>{`QuackerNews - Reply to ${data.id}`}</PageTitle>
              <CommentReply comment={data} />
            </>
          );
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideDataProps<{ id: string }>> = async ctx => {
  const id = ctx.query.id as string;
  return dehydrateQueries(ctx, async ssg => await ssg.fetchQuery('comment.byId', { id }), { id });
};

ReplyPage.getLayout = (page: React.ReactElement) => {
  return <ReplyLayout>{page}</ReplyLayout>;
};

export default ReplyPage;
