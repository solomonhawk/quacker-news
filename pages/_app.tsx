import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { ErrorBoundaryAuth } from 'components/error-boundaries/auth';
import { ErrorBoundaryExceptional } from 'components/error-boundaries/exceptional';
import { GlobalProgress } from 'components/global-progress';
import { InvalidateCache } from 'components/invalidate-cache';
import { AppLayout } from 'components/layouts/app-layout';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { AppRouter } from 'server/router';
import superjson from 'superjson';
import '../styles/globals.css';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.groupCollapsed(`${metric.name}: ${Math.round(metric.value * 10) / 10} ms`);
  console.table(metric);
  console.groupEnd();
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
      <InvalidateCache initialSession={pageProps.session} />

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

  if (process.env.VERCEL_URL) {
    return `${process.env.VERCEL_URL}/api/trpc`;
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
