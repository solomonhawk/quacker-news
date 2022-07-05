const fmt = new Intl.RelativeTimeFormat('en-US');

const DIVISIONS = [
  { amount: 60, name: 'seconds', intervalMs: 1000 },
  { amount: 60, name: 'minutes', intervalMs: 5 * 1000 },
  { amount: 24, name: 'hours', intervalMs: 5 * 60 * 1000 },
  { amount: 7, name: 'days', intervalMs: 60 * 60 * 1000 },
  { amount: 4.34524, name: 'weeks', intervalMs: Number.POSITIVE_INFINITY },
  { amount: 12, name: 'months', intervalMs: Number.POSITIVE_INFINITY },
  {
    amount: Number.POSITIVE_INFINITY,
    name: 'years',
    intervalMs: Number.POSITIVE_INFINITY,
  },
] as const;

export const formatTimeAgo = (date: Date): { text: string; intervalMs: number } => {
  let duration = (date.getTime() - Date.now()) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];

    if (Math.abs(duration) < division.amount) {
      return {
        text: fmt.format(Math.round(duration), division.name),
        intervalMs: division.intervalMs,
      };
    }

    duration /= division.amount;
  }

  return { text: 'Unknown', intervalMs: Number.POSITIVE_INFINITY };
};
