import dynamic from 'next/dynamic';
import { formatTimeAgo } from 'helpers/date';

export const PostTimestamp = ({ date }: { date: Date }) => {
  return <span>{formatTimeAgo(date)}</span>;
};

// Avoid hydration mismatch between SSR and client render
// ref: https://github.com/vercel/next.js/discussions/35773
export default dynamic(() => Promise.resolve(PostTimestamp), { ssr: false });
