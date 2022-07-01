import { PrismaClient } from '@prisma/client';
import { users, posts, comments, postUpvotes } from './seeds';

const prisma = new PrismaClient();

const load = async () => {
  try {
    await comments.cleanup(prisma);
    await postUpvotes.cleanup(prisma);
    await posts.cleanup(prisma);
    await users.cleanup(prisma);

    await users.seed(prisma);
    await posts.seed(prisma);
    await postUpvotes.seed(prisma);
    await comments.seed(prisma);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
