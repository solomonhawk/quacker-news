import { AddPostForm } from 'components/add-post-form';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';

const SubmitPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuackerNews - Submit Post</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AddPostForm />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  return { props: { session: await getSession(ctx) } };
};

export default SubmitPage;
