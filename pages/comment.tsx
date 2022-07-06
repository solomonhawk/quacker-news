import { CommentReply } from 'components/comment-reply';
import { Comment } from 'components/post/comment';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { trpc } from 'lib/trpc';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { DefaultQueryCell } from 'components/default-query-cell';

const CommentPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
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
        success={({ data }) => {
          return (
            <>
              <Head>
                <title>{`QuackerNews - Comment on ${data.post.title}`}</title>
              </Head>

              <CommentReply comment={data} />

              {data.comments.map(comment => {
                return <Comment key={comment.id} comment={comment} />;
              })}
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
    await ssg.fetchQuery('comment.byId', { id });
  });

  return { props: { ...dataProps, id } };
};

export default CommentPage;
