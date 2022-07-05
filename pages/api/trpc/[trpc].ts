import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'server/context';
import { appRouter } from 'server/router';

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
});
