import { createSSGHelpers } from '@trpc/react/ssg';
import { TRPCError } from '@trpc/server';
import { prisma } from 'lib/prisma';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
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
  const session = await getSession({ ctx });

  try {
    const ssg = createSSGHelpers({
      router: appRouter,
      ctx: { prisma, user: session?.user },
      transformer: superjson,
    });

    await fetchData(ssg);

    return { trpcState: ssg.dehydrate(), session };
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
