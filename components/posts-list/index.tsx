import { InferQueryOutput } from 'helpers/trpc';
import Link from 'next/link';
import { PostRow } from './post-row';

type Posts = InferQueryOutput<'post.all'>;

type Props = {
  posts: Posts['posts'];
  hasMorePages: boolean;
  nextPageUrl: string;
};

export const PostsList = ({ posts, hasMorePages, nextPageUrl }: Props) => {
  return (
    <div className="bg-[#f6f6ef]">
      <ol>
        {posts.map(post => {
          return (
            <li key={post.id} className="flex items-start p-2">
              <PostRow post={post} />
            </li>
          );
        })}
      </ol>

      {hasMorePages && (
        <div className="p-4 ml-4">
          <Link href={nextPageUrl}>
            <a className="link">More</a>
          </Link>
        </div>
      )}
    </div>
  );
};