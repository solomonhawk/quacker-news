import { NextPage } from 'next';
import Head from 'next/head';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuackerNews - Page Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="p-4">
        <h1>Page Not Found</h1>
      </div>
    </>
  );
};

export default NotFound;
