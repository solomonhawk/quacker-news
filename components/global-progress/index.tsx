import { finish, start } from 'lib/nprogress';
import Router from 'next/router';
import { useEffect, useRef } from 'react';
import { useIsFetching, useIsMutating } from 'react-query';

export const GlobalProgress = () => {
  const transitioningRef = useRef(false);
  const queriesCount = useIsFetching();
  const mutationsCount = useIsMutating();

  // show loader while route changes are pending
  useEffect(() => {
    const onRouteChangeStart = () => {
      transitioningRef.current = true;
      start();
    };

    const onRouteChangeDone = () => {
      transitioningRef.current = false;
      finish();
    };

    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeError', onRouteChangeDone);
    Router.events.on('routeChangeComplete', onRouteChangeDone);

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeError', onRouteChangeDone);
      Router.events.off('routeChangeComplete', onRouteChangeDone);
    };
  }, []);

  // show loader while queries/mutations are pending
  useEffect(() => {
    if (queriesCount + mutationsCount > 0) {
      start();
    } else if (!transitioningRef.current) {
      finish();
    }
  }, [queriesCount, mutationsCount]);

  return null;
};
