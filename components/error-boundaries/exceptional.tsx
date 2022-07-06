import { useRouter } from 'next/router';
import React from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';
import NextError from 'next/error';
import { QueryErrorResetBoundary } from 'react-query';

export const ErrorBoundaryExceptional = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={() => {
            reset();
            router.push('/');
          }}
          fallbackRender={() => {
            return <NextError title="Something went wrong" statusCode={500} />;
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
