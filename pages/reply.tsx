import { CommentReply } from 'components/comment-reply';
import { ReplyLayout } from 'components/layouts/reply-layout';
import { trpc } from 'lib/trpc';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { NextPageWithLayout } from './_app';

const ReplyPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const commentQuery = trpc.useQuery(['comment.byId', { id }]);

  if (commentQuery.isLoading && !commentQuery.data) {
    return <div>Loading...</div>;
  }

  if (commentQuery.isError || !commentQuery.data) {
    return <div>Something went wrong...</div>;
  }

  const pageTitle = `QuackerNews - Reply to ${commentQuery.data.id}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CommentReply comment={commentQuery.data} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async ctx => {
  const id = ctx.query.id as string;

  const dataProps = await dehydrateQueries(ctx, async ssg => {
    await ssg.fetchQuery('comment.byId', { id });
  });

  return { props: { ...dataProps, id } };
};

ReplyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ReplyLayout>{page}</ReplyLayout>;
};

export default ReplyPage;
