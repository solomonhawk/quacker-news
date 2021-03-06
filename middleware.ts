import { NextRequest, NextResponse } from 'next/server';
import qs from 'query-string';

export function middleware(request: NextRequest) {
  // guard /item?id=:id against missing `id` param
  if (request.nextUrl.pathname.startsWith('/item')) {
    if (!qs.parse(request.nextUrl.search)?.id) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/item',
};
