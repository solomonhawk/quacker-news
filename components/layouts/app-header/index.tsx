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
      <span className="border border-solid border-white w-[20px] h-[20px] mr-1">
        <Image src="/y18.gif" alt="" width="18" height="18" />
      </span>

      <Link href="/">
        <a className="leading-none font-bold">
          <h1>News for Quackers</h1>
        </a>
      </Link>

      <nav className="ml-2 divide-x divide-black">
        {links.map(link => {
          return (
            <Link key={link.href} href={link.href}>
              <a className="px-1">{link.text}</a>
            </Link>
          );
        })}
      </nav>

      <Link href="/login">
        <a className="px-1 ml-auto">login</a>
      </Link>
    </header>
  );
};
