import { User } from '@prisma/client';

export const users: User[] = [
  {
    id: '1',
    email: 'solomon.hawk@viget.com',
    username: 'solomon.hawk',
    passwordHash: 'whatever',
  },
];
