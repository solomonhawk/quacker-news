import dynamic from 'next/dynamic';
import { formatTimeAgo } from 'helpers/date';
import { useEffect, useRef, useState } from 'react';

// @TODO(shawk): fix double render?
const TimestampImpl = ({ date }: { date: Date }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { text, intervalMs } = formatTimeAgo(date);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isFinite(intervalMs)) {
      timerRef.current = setTimeout(() => {
        setLastUpdated(new Date());
      }, intervalMs);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [date, intervalMs, lastUpdated]);

  return <>{text}</>;
};

// Avoid hydration mismatch between SSR and client render
// ref: https://github.com/vercel/next.js/discussions/35773
export const Timestamp = dynamic(() => Promise.resolve(TimestampImpl), {
  ssr: false,
});
