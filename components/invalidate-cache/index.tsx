import { trpc } from 'lib/trpc';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

/**
 * This component handles invalidating react-query queries when the user's
 * session state changes (i.e. they log in or out after loading the app). This
 * ensures queries dependent on the user session are refetched and don't display
 * stale data.
 *
 * In theory we could handle this by specifying the current user id as a query
 * key parameter in the react-query hooks but trpc doesn't seem to allow adding
 * arbitrary key segments and we don't want the current user id in the backend
 * router to be resolved from a requests body (to prevent "forgery"). Instead,
 * the backend router pulls the current user from the session attached to the
 * request context.
 *
 * Why isn't this just a custom hook? It needs to live inside of NextAuth's
 * <SessionProvider /> in order to access the session via `useSession`,
 * but exist near the root of the application.
 *
 * @param {Session | null} props.initialSession  the initial server-rendered user session
 * @returns {null}
 */
export const InvalidateCache = ({ initialSession }: { initialSession: Session | null }) => {
  const utils = trpc.useContext();
  const { status } = useSession();
  const loggedInRef = useRef(initialSession !== null);

  // @NOTE: when session loading ends, detect if status changed and invalidate
  useEffect(() => {
    const isLoggedIn = status === 'authenticated';

    if (status !== 'loading' && isLoggedIn !== loggedInRef.current) {
      utils.queryClient.invalidateQueries();
      loggedInRef.current = isLoggedIn;
    }
  }, [status, utils.queryClient]);

  return null;
};
