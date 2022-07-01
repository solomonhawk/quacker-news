import { useRouter } from 'next/router';
import { useEffect } from 'react';

type UseRequiredQueryParamOptions = {
  redirectTo: string;
};

export const useRequiredQueryParam = <T>(
  param: string,
  { redirectTo }: UseRequiredQueryParamOptions = { redirectTo: '/' },
) => {
  const router = useRouter();
  const paramValue = router.query[param];

  useEffect(() => {
    if (!paramValue) {
      router.push(redirectTo);
    }
  }, [router, redirectTo, paramValue]);

  // return paramValue ? (paramValue as T) : undefined;
  return paramValue as T;
};
