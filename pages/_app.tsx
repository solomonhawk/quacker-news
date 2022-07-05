import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { AppLayout } from 'components/layouts/app-layout';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import nProgress from 'nprogress';
import { AppRouter } from 'server/router';
import superjson from 'superjson';
import '../styles/globals.css';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric.label, metric);
}

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement | null;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => <AppLayout>{page}</AppLayout>);

  return <SessionProvider session={pageProps.session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>;
}

function getApiUrl() {
  if (typeof window !== 'undefined') {
    return '/api/trpc';
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
}

export default withTRPC<AppRouter>({
  ssr: false,
  config() {
    return {
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: getApiUrl(),
        }),
      ],
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 min
          },
        },
      },
    };
  },
})(MyApp);
