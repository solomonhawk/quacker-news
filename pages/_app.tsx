import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { AppLayout } from 'components/layouts/app-layout';
import { NextPage } from 'next';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
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

  return getLayout(<Component {...pageProps} />);
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
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
          url: `${getBaseUrl()}/api/trpc`,
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
