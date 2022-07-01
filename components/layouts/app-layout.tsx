import React from 'react';
import { AppHeader } from './app-header';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="container mx-auto px-4">
      <AppHeader />
      {children}
    </main>
  );
};
