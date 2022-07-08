import { ErrorLayout } from 'components/layouts/error-layout';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

const InternalServerError: NextPage<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>QuackerNews - Sorry, it broke!</title>
        <meta name="robots" content="noindex" />
      </Head>

      <ErrorLayout>
        <div className="p-2">
          <h1>Internal Server Error</h1>
          {children}
        </div>
      </ErrorLayout>
    </>
  );
};

export default InternalServerError;
