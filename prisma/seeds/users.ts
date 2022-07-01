import { Prisma, PrismaClient } from '@prisma/client';

export const seed = async (prisma: PrismaClient) => {
  const users: Prisma.UserCreateManyInput[] = [
    {
      email: 'solomon.hawk@viget.com',
      username: 'solomon.hawk',
      passwordHash: 'whatever',
    },
    {
      email: 'solomon.hawk2@viget.com',
      username: 'solomon.hawk2',
      passwordHash: 'whatever',
    },
    {
      email: 'solomon.hawk3@viget.com',
      username: 'solomon.hawk3',
      passwordHash: 'whatever',
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  console.log('Added users data');
};

export const cleanup = async (prisma: PrismaClient) => {
  await prisma.user.deleteMany();

  console.log('Deleted records in users table');
};
