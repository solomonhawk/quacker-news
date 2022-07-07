import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { UserKarma } from './user-karma';

const links = [
  { text: 'welcome', href: '/welcome', requireAuth: true },
  { text: 'new', href: '/newest' },
  { text: 'threads', href: '/threads', requireAuth: true },
  { text: 'past', href: '/front' },
  { text: 'comments', href: '/newcomments' },
  { text: 'ask', href: '/ask' },
  { text: 'show', href: '/show' },
  { text: 'jobs', href: '/jobs' },
  { text: 'submit', href: '/submit' },
];

export const AppHeader = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-orange-500 p-[2px] flex items-center">
      <Link href="/">
        <a className="border border-solid border-white w-[20px] h-[20px] mr-1 flex-shrink-0">
          <Image src="/y18.gif" alt="" width="18" height="18" />
        </a>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center ml-2 sm:ml-1">
        <Link href="/">
          <a className="leading-none font-bold px-1 sm:px-0">
            <h1>News for Quackers</h1>
          </a>
        </Link>

        <nav className="sm:ml-2 divide-x divide-black flex flex-wrap py-1">
          {links
            .filter(link => (session ? true : !link.requireAuth))
            .map(link => {
              return (
                <Link key={link.href} href={link.href}>
                  <a className="px-1 leading-none">{link.text}</a>
                </Link>
              );
            })}
        </nav>
      </div>

      {status === 'unauthenticated' && (
        <Link href="/login">
          <a className="px-1 ml-auto">login</a>
        </Link>
      )}

      {session && (
        <div className="ml-auto flex-shrink-0">
          <Link href={`/user?id=${session.user?.id}`}>
            <a className="px-1 ml-auto">{session.user?.username}</a>
          </Link>

          <UserKarma />

          <Link href="/api/auth/signout">
            <a
              className="px-1"
              onClick={e => {
                e.preventDefault();
                signOut({ redirect: false });
              }}
            >
              sign out
            </a>
          </Link>
        </div>
      )}
    </header>
  );
};
