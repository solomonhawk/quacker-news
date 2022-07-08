import { createRouter } from 'server/create-router';
import * as comments from 'server/domains/comments';
import { paginationSchema } from 'server/domains/pagination';
import * as posts from 'server/domains/posts';
import { OrderType, SearchQueryResult, SearchType } from 'server/domains/search/helpers';
import { z } from 'zod';

export const searchRouter = createRouter()
  /**
   * @description Query all posts and/or comments
   */
  .query('query', {
    input: z
      .object({
        query: z.string().optional(),
        order: z.nativeEnum(OrderType).default(OrderType.DATE),
        type: z.nativeEnum(SearchType).default(SearchType.POST),
      })
      .merge(paginationSchema),
    async resolve({ input: { page, perPage, query, order, type }, ctx }): Promise<SearchQueryResult> {
      switch (type) {
        case SearchType.POST: {
          return {
            type: SearchType.POST,
            query,
            order,
            results: await posts.search(ctx, page, perPage, order, query),
          };
        }

        case SearchType.COMMENT: {
          return {
            type: SearchType.COMMENT,
            query,
            order,
            results: await comments.search(ctx, page, perPage, order, query),
          };
        }
      }
    },
  });
