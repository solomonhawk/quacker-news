import { Comment } from '@prisma/client';

export const comments: Comment[] = [
  {
    id: '1',
    content: 'ts shill detected',
    createdAt: new Date(),
    parentId: null,
    postId: '1',
    authorId: '1',
  },
];
