import { CommentReply } from 'components/comment-reply';
import { Comment } from 'components/post/comment';
import { dehydrateQueries } from 'lib/trpc/dehydrate-queries';
import { trpc } from 'lib/trpc';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { DefaultQueryCell } from 'components/default-query-cell';
import { PageTitle } from 'components/page-title';

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
              <PageTitle>{`QuackerNews - Comment on ${data.post.title}`}</PageTitle>

              <CommentReply comment={data} />

              <div className="ml-4 pb-4">
                {data.comments.map(comment => {
                  return <Comment key={comment.id} comment={comment} />;
                })}
              </div>
            </>
          );
        }}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async ctx => {
  const id = ctx.query.id as string;
  return dehydrateQueries(ctx, async ssg => await ssg.fetchQuery('comment.byId', { id }), { id });
};

export default CommentPage;
