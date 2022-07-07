import Link from 'next/link';

const links = [
  { text: 'Guidelines', href: '/guidelines' },
  { text: 'FAQ', href: '/faq' },
  { text: 'Lists', href: '/lists' },
  { text: 'API', href: '/api' },
  { text: 'Security', href: '/security' },
  { text: 'Legal', href: '/legal' },
  { text: 'Apply to YC', href: 'http://www.ycombinator.com/apply/' },
  { text: 'Contact', href: 'mailto:solomon.hawk@viget.com' },
];

const SearchForm = () => {
  return (
    <form>
      <label htmlFor="query">Search: </label>
      <input id="query" type="text" name="query" className="border border-gray-500 rounded-sm text-sm p-[2px]" />
    </form>
  );
};

export const AppFooter = () => {
  return (
    <footer className="border-t-2 border-orange-500 bg-[#f6f6ef] p-4 flex flex-col items-center">
      <nav className="sm:ml-2 divide-x divide-black flex flex-wrap py-1 mb-4">
        {links.map(link => {
          return (
            <Link key={link.href} href={link.href}>
              <a className="px-1 leading-none text-sm hover:underline opacity-60 hover:opacity-100">{link.text}</a>
            </Link>
          );
        })}
      </nav>
      <SearchForm />
    </footer>
  );
};
