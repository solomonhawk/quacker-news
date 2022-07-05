import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getCsrfToken } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Login: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ csrfToken }) => {
  const {
    query: { error },
  } = useRouter();

  return (
    <>
      <Head>
        <title>QuackerNews - Log In</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-[#f6f6ef] p-4">
        <h1 className="text-xl font-semibold mb-4">Log In</h1>

        {error ? (
          <p role="alert" className="font-bold text-red-500 my-2">
            {error}
          </p>
        ) : null}

        <form method="post" action="/api/auth/callback/credentials" className="mb-4">
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <div className="mb-1">
            <label className="block" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              className="border border-gray-700 rounded-sm p-1"
            />
          </div>

          <div className="mb-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="border border-gray-700 rounded-sm p-1"
            />
          </div>

          <button className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 rounded border border-gray-700 px-2 font-mono">
            Log In
          </button>
        </form>

        <span className="opacity-60">New user? </span>

        <Link href="/register">
          <a className="hover:underline">Create Account</a>
        </Link>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default Login;
