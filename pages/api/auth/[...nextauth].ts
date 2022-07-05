import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'lib/prisma';
import bcrypt from 'bcryptjs';
import * as users from 'server/domains/users';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.SECRET,
  },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/register',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session) {
        session.user = token.user as User;
      }

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Log In',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'quacker' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User> {
        console.log('authorize', credentials);

        if (!credentials) {
          throw new Error('Invalid request');
        }

        const user = await users.byUsername({ user: undefined, prisma }, credentials.username);

        if (!user) {
          await prisma.$disconnect();
          throw new Error('Login failed');
        }

        if (!(await bcrypt.compare(credentials.password, user.passwordHash))) {
          await prisma.$disconnect();
          throw new Error('Login failed');
        }

        const karma = await users.karma({ user: { ...user, karma: 0 }, prisma });

        return { id: user.id, email: user.email, username: user.username, karma };
      },
    }),
  ],
});
