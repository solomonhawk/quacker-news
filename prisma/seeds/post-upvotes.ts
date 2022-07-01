import { Prisma, PrismaClient } from '@prisma/client';

export const seed = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();

  if (!users.length) {
    throw new Error('Failed to seed post upvotes, no users found');
  }

  if (!posts.length) {
    throw new Error('Failed to seed post upvotes, no posts found');
  }

  const postUpvotes: Prisma.PostUpvoteCreateManyInput[] = [
    {
      postId: posts[0].id,
      userId: users[1].id,
    },
    {
      postId: posts[1].id,
      userId: users[0].id,
    },
  ];

  await prisma.postUpvote.createMany({
    data: postUpvotes,
  });

  console.log('Added post upvotes data');
};

export const cleanup = async (prisma: PrismaClient) => {
  await prisma.postUpvote.deleteMany();

  console.log('Deleted records in post upvotes table');
};
