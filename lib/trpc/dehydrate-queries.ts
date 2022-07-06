import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { GetServerSidePropsContext } from 'next';
import { createContext } from 'server/context';
import { appRouter, AppRouter } from 'server/router';
import superjson from 'superjson';

/**
 * When you need to pre-fetch tRPC query results during SSR, you can use this
 * function which handles pulling in the session, setting up the tRPC context,
 * router, and transformers, and then passes the dehydrated `trpcState` along
 * with the `session` back for the component to use as `pageProps`.
 *
 * @param ctx NextJS `getServerSideProps` context
 * @param fetchData async callback to fetch data during `getServerSideProps`
 * @returns props to be passed to the component
 */
export const dehydrateQueries = async (
  ctx: GetServerSidePropsContext,
  fetchData: (ssg: ReturnType<typeof createSSGHelpers<AppRouter>>) => Promise<void>,
) => {
  try {
    const trpcContext = await createContext({ req: ctx.req, res: ctx.res });

    const ssg = createSSGHelpers({
      router: appRouter,
      ctx: trpcContext,
      transformer: superjson,
    });

    await fetchData(ssg);

    return { trpcState: ssg.dehydrate(), session: trpcContext.session };
  } catch (error) {
    if (error instanceof TRPCError) {
      if (error.code === 'NOT_FOUND') {
        return {
          notFound: true,
        };
      }
    }

    throw error;
  }
};
