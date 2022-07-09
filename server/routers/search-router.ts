import { createRouter } from 'server/create-router';
import * as comments from 'server/domains/comments';
import * as posts from 'server/domains/posts';
import { SearchQueryResult, searchQuerySchema, SearchType } from 'server/domains/search/helpers';

export const searchRouter = createRouter()
  /**
   * @description Query posts or comments
   */
  .query('query', {
    input: searchQuerySchema,
    async resolve({ input: { page, perPage, query, order, type }, ctx }): Promise<SearchQueryResult> {
      switch (type) {
        case SearchType.POST: {
          return {
            type,
            query,
            order,
            results: await posts.search(ctx, page, perPage, order, query),
          };
        }

        case SearchType.COMMENT: {
          return {
            type,
            query,
            order,
            results: await comments.search(ctx, page, perPage, order, query),
          };
        }
      }
    },
  });
