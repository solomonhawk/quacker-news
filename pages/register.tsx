import { trpc } from 'lib/trpc';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useErrorHandler } from 'react-error-boundary';

export const Register = () => {
  const router = useRouter();
  const handleError = useErrorHandler();

  const registerUser = trpc.useMutation('user.create', {
    onSuccess: async (_data, { username, password }) => {
      await signIn('credentials', { username, password, redirect: false });
      router.push('/');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (formData.get('password') !== formData.get('password_confirmation')) {
      return alert('passwords must match');
    }

    return registerUser
      .mutateAsync({
        email: formData.get('email') as string,
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      })
      .catch(e => {
        if (e.data.code !== 'CONFLICT') {
          handleError(e);
        }
      });
  };

  return (
    <>
      <Head>
        <title>QuackerNews - Create Account</title>
        <meta name="description" content="News for quacks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-[#f6f6ef] p-4">
        <h1 className="text-xl font-semibold mb-4">Create Account</h1>

        {registerUser.error ? <span className="block text-red-500 mb-2">{registerUser.error.message}</span> : null}

        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" name="email" required className="border border-gray-700 rounded-sm p-1" />
          </div>

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

          <div className="mb-2">
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

          <div className="mb-4">
            <label className="block" htmlFor="password_confirmation">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              required
              className="border border-gray-700 rounded-sm p-1"
            />
          </div>

          <button
            type="submit"
            disabled={registerUser.isLoading}
            className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-200 rounded border border-gray-700 px-2 font-mono"
          >
            {registerUser.isLoading || registerUser.isSuccess ? 'Please wait...' : 'Create Account'}
          </button>
        </form>

        <span className="opacity-60">Already have an account? </span>

        <Link href="/login">
          <a className="hover:underline">Log In</a>
        </Link>
      </div>
    </>
  );
};

export default Register;
