import { useSession } from 'next-auth/react';
import { resolveHref } from 'next/dist/shared/lib/router/router';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

// @TODO(shawk): handle this logic via server responses (status 401) and redirects
export const ProtectedLink = ({ href, children, ...props }: LinkProps & { children: React.ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();

  let destination = resolveHref(router, href);

  if (status !== 'authenticated') {
    destination = `/login?redirect=${encodeURIComponent(destination)}`;
  }

  return (
    <Link {...props} href={destination}>
      {children}
    </Link>
  );
};
