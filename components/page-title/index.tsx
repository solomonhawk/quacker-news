import Head from 'next/head';

export const PageTitle = ({ children }: { children: string }) => {
  return (
    <Head>
      <title>{children}</title>
    </Head>
  );
};
