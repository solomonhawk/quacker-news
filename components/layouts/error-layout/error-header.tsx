import Image from 'next/image';
import Link from 'next/link';

export const ErrorHeader = () => {
  return (
    <header className="bg-orange-500 p-[2px] flex items-center">
      <Link href="/">
        <a className="border border-solid border-white w-[20px] h-[20px] mr-1">
          <Image src="/y18.gif" alt="" width="18" height="18" />
        </a>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center ml-2 sm:ml-1">
        <a className="leading-none font-bold px-1 sm:px-0">
          <h1>Whoops...</h1>
        </a>
      </div>
    </header>
  );
};
