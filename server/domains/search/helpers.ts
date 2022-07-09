import * as posts from 'server/domains/posts';
import * as comments from 'server/domains/comments';
import { paginationSchema } from '../pagination';
import { z } from 'zod';

export enum SearchType {
  POST = 'post',
  COMMENT = 'comment',
}

export enum OrderType {
  DATE = 'date',
  POPULARITY = 'popularity',
}

export const searchTypeLabels = {
  [SearchType.POST]: 'Posts',
  [SearchType.COMMENT]: 'Comments',
};

export const orderTypeLabels = {
  [OrderType.DATE]: 'Date',
  [OrderType.POPULARITY]: 'Popularity',
};

export const searchQuerySchema = z
  .object({
    query: z.string().optional(),
    order: z.nativeEnum(OrderType).default(OrderType.DATE),
    type: z.nativeEnum(SearchType).default(SearchType.POST),
  })
  .merge(paginationSchema);

export type SearchQueryResult = { query?: string; order?: OrderType } & (
  | {
      type: SearchType.POST;
      results: Awaited<ReturnType<typeof posts.search>>;
    }
  | {
      type: SearchType.COMMENT;
      results: Awaited<ReturnType<typeof comments.search>>;
    }
);

export const highlightSearchTerm = (text: string, query?: string) => {
  return query ? text.split(query).join(`<em class="bg-yellow-300 font-bold not-italic">${query}</em>`) : text;
};
