import { usePageNumberQuery } from 'helpers/hooks/use-page-number-query';
import { trpc } from 'lib/trpc';
import Link from 'next/link';
import { PostRow } from './post-row';

export const PostsList = () => {
  const page = usePageNumberQuery();
  const postsQuery = trpc.useQuery(['post.all', { page }]);

  if (postsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postsQuery.isError || !postsQuery.data) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div className="bg-[#f6f6ef]">
      <ol>
        {postsQuery.data.posts.map(post => {
          return (
            <li key={post.id} className="flex items-start p-2">
              <PostRow post={post} />
            </li>
          );
        })}
      </ol>

      <Link href={`/news?p=${page + 1}`}>
        <a className="link">More</a>
      </Link>
    </div>
  );
};
