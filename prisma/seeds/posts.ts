import { PostType, Prisma, PrismaClient } from '@prisma/client';

export const seed = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();

  if (!users.length) {
    throw new Error('Failed to seed posts, no users found');
  }

  const posts: Prisma.PostCreateManyInput[] = [
    {
      title: 'Hacker News is fake',
      content: null,
      createdAt: new Date(),
      url: 'https://news.ycombinator.com/item?id=31939983',
      type: PostType.STORY,
      authorId: users[0].id,
    },
    {
      title: 'Hello World',
      content: 'This is my first post',
      createdAt: new Date(),
      url: null,
      type: PostType.DISCUSSION,
      authorId: users[1].id,
    },
  ];

  await prisma.post.createMany({
    data: posts,
  });

  console.log('Added posts data');
};

export const cleanup = async (prisma: PrismaClient) => {
  await prisma.post.deleteMany();

  console.log('Deleted records in post table');
};
