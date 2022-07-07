import React from 'react';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="sm:p-2">
        <div className="sm:container mx-auto sm:px-4">
          <AppHeader />
          {children}
          <AppFooter />
        </div>
      </main>
    </>
  );
};
