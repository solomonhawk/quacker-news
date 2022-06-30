import { useRouter } from 'next/router';

export const usePageNumberQuery = () => {
  const router = useRouter();
  const { p } = router.query;

  if (typeof p !== 'string') {
    return 1;
  }

  const page = parseInt(p, 10);

  return isNaN(page) ? 1 : page;
};
