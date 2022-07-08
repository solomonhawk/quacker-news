import * as posts from 'server/domains/posts';
import * as comments from 'server/domains/comments';

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
  return query ? text.split(query).join(`<em class="bg-yellow-200 font-semibold not-italic">${query}</em>`) : text;
};
