import NextError from 'next/error';
import { useRouter } from 'next/router';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
