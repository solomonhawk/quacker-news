import { trpc } from 'lib/trpc';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export const Register = () => {
  const registerUser = trpc.useMutation('user.create');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (formData.get('password') !== formData.get('password_confirmation')) {
      throw new Error('passwords must match');
    }

    return registerUser.mutateAsync({
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
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

        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="mb-1">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" name="email" required className="border border-gray-700 rounded-sm p-1" />
          </div>

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

          <div className="mb-1">
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

          <button className="block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 rounded border border-gray-700 px-2 font-mono">
            Create Account
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
