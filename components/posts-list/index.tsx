import { InferQueryOutput } from 'helpers/trpc';
import Link from 'next/link';
import { PostRow } from './post-row';

type Posts = InferQueryOutput<'post.all'>;

type Props = {
  posts: Posts['posts'];
  nextPageUrl?: string;
};

export const PostsList = ({ posts, nextPageUrl }: Props) => {
  return (
    <div className="bg-[#f6f6ef]">
      <ol className="py-1">
        {posts.map(post => {
          return (
            <li key={post.id} className="flex items-start px-2 py-1">
              <PostRow post={post} />
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
