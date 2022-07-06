import { TRPCClientError } from '@trpc/client';
import type { TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';
import { AppRouter } from 'server/router';

const isAuthenticationError = (error: Error | TRPCClientErrorLike<AppRouter>) => {
  return error instanceof TRPCClientError && error.message === 'UNAUTHORIZED';
};

const ErrorFallback = ({ children, error, resetErrorBoundary }: FallbackProps & { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticationError(error)) {
      resetErrorBoundary();
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [error, router, resetErrorBoundary]);

  return <>{children}</>;
};

export const ErrorBoundaryAuth = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      fallbackRender={props => {
        return <ErrorFallback {...props}>{children}</ErrorFallback>;
      }}
      onError={error => {
        if (!isAuthenticationError(error)) {
          throw error;
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
