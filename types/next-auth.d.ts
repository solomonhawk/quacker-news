/* eslint-disable @typescript-eslint/no-unused-vars */
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username: string;
    karma: number;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    user: User;
  }
}
