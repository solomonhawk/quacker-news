import { trpc } from 'lib/trpc';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { appRouter } from 'server/router';
import superjson from 'superjson';
import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { prisma } from 'lib/prisma';
import { CommentReply } from 'components/comment-reply';
import { ReplyLayout } from 'components/layouts/reply-layout';
import { NextPageWithLayout } from './_app';
import { getSession } from 'next-auth/react';

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
  const session = await getSession({ ctx });

  try {
    const ssg = await createSSGHelpers({
      router: appRouter,
      ctx: { prisma, user: session?.user },
      transformer: superjson,
    });

    await ssg.fetchQuery('comment.byId', { id });

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

ReplyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <ReplyLayout>{page}</ReplyLayout>;
};

export default ReplyPage;
