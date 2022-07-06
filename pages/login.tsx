import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation } from 'react-query';

export const Login: NextPage = () => {
  const router = useRouter();
  const { redirect } = router.query;

  const login = useMutation(
    async (credentials: { username: string; password: string }) => {
      return await signIn('credentials', {
        ...credentials,
        callbackUrl: (redirect as string) || '/',
        redirect: false,
      }).then(response => {
        if (response?.error) {
          throw response.error;
        }

        return response;
      });
    },
    {
      // don't propagate 401's to the error boundary, handle them locally
      useErrorBoundary: false,
      onSuccess: response => {
        if (response?.url) {
          router.push(response.url);
        }
      },
    },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    return login.mutateAsync({
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <>
      <Head>
        <title>QuackerNews - Log In</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-[#f6f6ef] p-4">
        <h1 className="text-xl font-semibold mb-4">Log In</h1>

        {login.status === 'error' && (
          <p role="alert" className="font-bold text-red-500 my-2">
            {login.error as string}
          </p>
        )}

        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="mb-2">
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

          <button
            type="submit"
            disabled={login.isLoading}
            className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-200 rounded border border-gray-700 px-2 font-mono"
          >
            {login.isLoading || login.isSuccess ? 'Please wait...' : 'Log In'}
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

export default Login;
