import { Prisma, PrismaClient } from '@prisma/client';

export const seed = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();

  if (!users.length) {
    throw new Error('Failed to seed comments, no user found');
  }

  if (!posts.length) {
    throw new Error('Failed to seed comments, no post found');
  }

  const comments: Prisma.CommentCreateManyInput[] = [
    {
      content: 'ts shill detected',
      createdAt: new Date(),
      parentId: null,
      postId: posts[0].id,
      authorId: users[1].id,
    },
    {
      content: 'this sucks',
      createdAt: new Date(),
      parentId: null,
      postId: posts[1].id,
      authorId: users[0].id,
    },
  ];

  await prisma.comment.createMany({
    data: comments,
  });

  const commentRecords = await prisma.comment.findMany();

  const commentComments: Prisma.CommentCreateManyInput[] = [
    {
      content: 'go back to stack overflow',
      createdAt: new Date(),
      parentId: commentRecords[0].id,
      postId: null,
      authorId: users[1].id,
    },
  ];

  await prisma.comment.createMany({
    data: commentComments,
  });

  console.log('Added comments data');
};

export const cleanup = async (prisma: PrismaClient) => {
  await prisma.comment.deleteMany();

  console.log('Deleted records in comments table');
};
