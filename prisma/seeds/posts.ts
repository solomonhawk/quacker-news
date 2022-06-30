import { Post } from '@prisma/client';

export const posts: Post[] = [
  {
    id: '1',
    title: 'Hello World',
    content: 'This is my first post',
    authorId: '1',
    createdAt: new Date(),
    url: null,
  },
];
