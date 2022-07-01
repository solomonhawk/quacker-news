import * as trpc from '@trpc/server';
import superjson from 'superjson';
import { commentUpvotesRouter } from './routers/comment-upvotes-router';
import { commentsRouter } from './routers/comments-router';
import { postUpvotesRouter } from './routers/post-upvotes-router';
import { postsRouter } from './routers/posts-router';
import { usersRouter } from './routers/users-router';

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge('user.', usersRouter)
  .merge('post.', postsRouter)
  .merge('post.upvote.', postUpvotesRouter)
  .merge('comment.', commentsRouter)
  .merge('comment.upvote.', commentUpvotesRouter);

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;
