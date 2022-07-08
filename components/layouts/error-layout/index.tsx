import React from 'react';
import { ErrorHeader } from './error-header';

export const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="sm:p-2">
      <div className="sm:container mx-auto sm:px-4">
        <ErrorHeader />
        <div className="bg-[#f6f6ef]">{children}</div>
      </div>
    </main>
  );
};
