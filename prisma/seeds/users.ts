import { Prisma, PrismaClient } from '@prisma/client';

export const seed = async (prisma: PrismaClient) => {
  const users: Prisma.UserCreateManyInput[] = [
    {
      email: 'solomon.hawk@viget.com',
      username: 'shawk',
      // "password"
      passwordHash: '$2a$10$MNQdW.ubu1IAb4bihXgVY.19a3piz//Yym98UjZ56XbUZO7Thug9y',
    },
    {
      email: 'solomon.hawk2@viget.com',
      username: 'solomon.hawk2',
      // "password"
      passwordHash: '$2a$10$MNQdW.ubu1IAb4bihXgVY.19a3piz//Yym98UjZ56XbUZO7Thug9y',
    },
    {
      email: 'solomon.hawk3@viget.com',
      username: 'solomonster',
      // "password"
      passwordHash: '$2a$10$MNQdW.ubu1IAb4bihXgVY.19a3piz//Yym98UjZ56XbUZO7Thug9y',
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
