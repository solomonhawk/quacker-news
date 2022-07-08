import { NextPage } from 'next';
import Head from 'next/head';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuackerNews - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>

      <h1>Page Not Found</h1>
    </>
  );
};

export default NotFound;
