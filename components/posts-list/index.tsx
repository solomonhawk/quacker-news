import { ArrayElement, InferQueryOutput } from 'helpers/trpc';
import Link from 'next/link';
import React from 'react';
import { PostRow } from './post-row';

type Posts = InferQueryOutput<'post.all'>;
type PostRowProps = { post: ArrayElement<Posts['records']> };
type Props = {
  posts: Posts['records'];
  nextPageUrl?: string;
  PostRowComponent?: (rowArgs: PostRowProps) => React.ReactElement;
};

export const PostsList = ({ posts, nextPageUrl, PostRowComponent = PostRow }: Props) => {
  return (
    <div className="pb-2">
      <ol className="py-2">
        {posts.map(post => {
          return (
            <li key={post.id} className="flex items-start px-3 py-1">
              <PostRowComponent post={post} />
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
