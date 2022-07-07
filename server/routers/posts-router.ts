import { paginationSchema } from 'server/domains/pagination';
import { z } from 'zod';
import * as posts from '../domains/posts';

export const postsRouter = createRouter()
  /**
   * @description Query all posts
   */
  .query('all', {
    input: paginationSchema,
    meta: {
      resourceName: 'post',
    },
    async resolve({ input: { page, perPage }, ctx }) {
      return posts.all(ctx, page, perPage);
    },
  })

  /**
   * @description Query post by ID
   */
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    meta: {
      resourceName: 'post',
    },
    async resolve({ input: { id }, ctx }) {
      return posts.byId(ctx, id);
    },
  });
