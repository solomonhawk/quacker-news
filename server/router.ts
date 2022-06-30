import * as trpc from '@trpc/server';
import { commentsRouter } from './routers/comments-router';
import { postsRouter } from './routers/posts-router';
import { usersRouter } from './routers/users-router';
import superjson from 'superjson';

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('user.', usersRouter)
  .merge('post.', postsRouter)
  .merge('comment.', commentsRouter);

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;
