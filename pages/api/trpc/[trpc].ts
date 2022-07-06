import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'server/context';
import { appRouter } from 'server/router';

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  batching: {
    enabled: true,
  },
  createContext,
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },
  responseMeta({ ctx, paths, type, errors }) {
    if (ctx?.res && !ctx?.session?.user && errors.length === 0 && type === 'query') {
      console.log('Returning cached query', paths);

      return {
        headers: {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      };
    }

    return {};
  },
});
