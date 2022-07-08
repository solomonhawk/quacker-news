import React from 'react';
import { ReplyHeader } from './reply-header';

export const ReplyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="sm:p-2">
      <div className="sm:container mx-auto sm:px-4">
        <ReplyHeader />
        <div className="bg-[#f6f6ef]">{children}</div>
      </div>
    </main>
  );
};
