import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { ErrorBoundaryAuth } from 'components/error-boundaries/auth';
import { ErrorBoundaryExceptional } from 'components/error-boundaries/exceptional';
import { GlobalProgress } from 'components/global-progress';
import { AppLayout } from 'components/layouts/app-layout';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { AppRouter } from 'server/router';
import superjson from 'superjson';
import '../styles/globals.css';
import 'lib/nprogress';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric.label, metric);
}

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactElement | null;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || (page => <AppLayout>{page}</AppLayout>);

  return (
    <SessionProvider session={pageProps.session}>
      <GlobalProgress />
      <ErrorBoundaryExceptional>
        <ErrorBoundaryAuth>{getLayout(<Component {...pageProps} />)}</ErrorBoundaryAuth>
      </ErrorBoundaryExceptional>
    </SessionProvider>
  );
}

function getApiUrl() {
  if (typeof window !== 'undefined') {
    return '/api/trpc';
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`;
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: opts =>
            process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: getApiUrl(),
          maxBatchSize: 10,
        }),
      ],
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            useErrorBoundary: true,
          },
          mutations: {
            useErrorBoundary: true,
          },
        },
      },
    };
  },
})(App);
