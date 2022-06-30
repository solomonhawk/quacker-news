import { formatTimeAgo } from 'helpers/date';
import { usePageNumberQuery } from 'helpers/hooks/use-page-number-query';
import { host } from 'helpers/url';
import { trpc } from 'lib/trpc';
import Link from 'next/link';

export const PostsList = () => {
  const page = usePageNumberQuery();
  const postsQuery = trpc.useQuery(['post.all', { page }]);

  const upvote = () => {
    return null;
  };

  if (postsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (postsQuery.isError || !postsQuery.data) {
    return <div>Something went wrong...</div>;
  }

  return (
    <div>
      <ol className="bg-[#f6f6ef]">
        {postsQuery.data.posts.map(post => {
          return (
            <li key={post.id} className="flex items-start p-2">
              <span>{post.position}.</span>

              <button className="ml-1 opacity-40" onClick={upvote}>
                ▲
              </button>

              <div className="flex flex-col">
                <div>
                  <Link href={post.url ?? `/item?id=${post.id}`}>
                    <a className="ml-1">{post.title}</a>
                  </Link>

                  {post.url ? (
                    <Link href={`/from?site=${host(post.url)}`}>
                      <a className="ml-2 text-sm opacity-60 hover:underline">({host(post.url)})</a>
                    </Link>
                  ) : null}
                </div>

                <div className="text-xs opacity-60">
                  {post._count.upvotes} points by{' '}
                  <Link href={`/user?id=${post.author.id}`}>
                    <a className="hover:underline">{post.author.username}</a>
                  </Link>{' '}
                  {formatTimeAgo(post.createdAt)} | <button className="hover:underline">hide</button> |{' '}
                  <Link href={`/item?id=${post.id}`}>
                    <a className="hover:underline">
                      {post._count.comment} comment{post._count.comment === 1 ? '' : 's'}
                    </a>
                  </Link>
                </div>
              </div>
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
