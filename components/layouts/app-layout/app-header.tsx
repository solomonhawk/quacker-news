import Image from 'next/image';
import Link from 'next/link';

const links = [
  { text: 'new', href: '/newest' },
  { text: 'past', href: '/front' },
  { text: 'comments', href: '/newcomments' },
  { text: 'ask', href: '/ask' },
  { text: 'show', href: '/show' },
  { text: 'jobs', href: '/jobs' },
  { text: 'submit', href: '/submit' },
];

export const AppHeader = () => {
  return (
    <header className="bg-orange-500 p-[2px] flex items-center">
      <Link href="/">
        <a className="border border-solid border-white w-[20px] h-[20px] mr-1">
          <Image src="/y18.gif" alt="" width="18" height="18" />
        </a>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center ml-2 sm:ml-1">
        <Link href="/">
          <a className="leading-none font-bold px-1 sm:px-0">
            <h1>News for Quackers</h1>
          </a>
        </Link>

        <nav className="sm:ml-2 divide-x divide-black">
          {links.map(link => {
            return (
              <Link key={link.href} href={link.href}>
                <a className="px-1">{link.text}</a>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link href="/login">
        <a className="px-1 ml-auto">login</a>
      </Link>
    </header>
  );
};
