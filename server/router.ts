import superjson from 'superjson';
import { createRouter } from './create-router';
import { loggingMiddleware } from './domains/logging/middleware';
import { commentUpvotesRouter } from './routers/comment-upvotes-router';
import { commentsRouter } from './routers/comments-router';
import { postUpvotesRouter } from './routers/post-upvotes-router';
import { postsRouter } from './routers/posts-router';
import { usersRouter } from './routers/users-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(loggingMiddleware)
  .merge('user.', usersRouter)
  .merge('post.', postsRouter)
  .merge('post.upvote.', postUpvotesRouter)
  .merge('comment.', commentsRouter)
  .merge('comment.upvote.', commentUpvotesRouter);

// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;
