import { PrismaClient } from '@prisma/client';
import { users, posts, comments } from './seeds';

const prisma = new PrismaClient();

const load = async () => {
  try {
    await prisma.post.deleteMany();
    console.log('Deleted records in post table');

    await prisma.comment.deleteMany();
    console.log('Deleted records in comment table');

    await prisma.user.deleteMany();
    console.log('Deleted records in user table');

    await prisma.user.createMany({
      data: users,
    });
    console.log('Added users data');

    await prisma.post.createMany({
      data: posts,
    });
    console.log('Added posts data');

    await prisma.comment.createMany({
      data: comments,
    });
    console.log('Added comments data');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
