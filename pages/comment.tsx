import { CommentReply } from 'components/comment-reply';
import { Comment } from 'components/post/comment';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { trpc } from 'lib/trpc';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';

const CommentPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const commentQuery = trpc.useQuery(['comment.byId', { id }]);

  if (commentQuery.isLoading && !commentQuery.data) {
    return <div>Loading...</div>;
  }

  if (commentQuery.isError || !commentQuery.data) {
    return <div>Something went wrong...</div>;
  }

  const pageTitle = `QuackerNews - Comment on ${commentQuery.data.post.title}`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CommentReply comment={commentQuery.data} />

      {commentQuery.data.comments.map(comment => {
        return <Comment key={comment.id} comment={comment} />;
      })}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  id: string;
}> = async ctx => {
  const id = ctx.query.id as string;

  const dataProps = await dehydrateQueries(ctx, async ssg => {
    await ssg.fetchQuery('comment.byId', { id });
  });

  return { props: { ...dataProps, id } };
};

export default CommentPage;
