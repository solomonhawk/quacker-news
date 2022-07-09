import Link from 'next/link';
import { SearchQueryResult, SearchType } from 'server/domains/search/helpers';
import { CommentRow } from './comment-row';

export type Comments = (SearchQueryResult & { type: SearchType.COMMENT })['results']['records'];

type Props = {
  comments: Comments;
  nextPageUrl?: string;
};

export const CommentsList = ({ comments, nextPageUrl }: Props) => {
  return (
    <div className="pb-2">
      <ol className="py-2">
        {comments.map(comment => {
          return (
            <li key={comment.id} className="flex items-start px-3 py-1">
              <CommentRow comment={comment} />
            </li>
          );
        })}
      </ol>

      {nextPageUrl && (
        <div className="p-4 ml-4">
          <Link href={nextPageUrl}>
            <a className="link">More</a>
          </Link>
        </div>
      )}
    </div>
  );
};
