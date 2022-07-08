import { useRouter } from 'next/router';
import InternalServerError from 'pages/500';
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
          fallbackRender={({ resetErrorBoundary }) => {
            return (
              <InternalServerError>
                <button
                  type="button"
                  className="mt-2 block bg-gray-100 hover:bg-gray-200 active:bg-gray-100 disabled:bg-gray-200 rounded border border-gray-700 px-2 font-mono"
                  onClick={resetErrorBoundary}
                >
                  Take me back to the app
                </button>
              </InternalServerError>
            );
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
