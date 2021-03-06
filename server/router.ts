import superjson from 'superjson';
import { createRouter } from './create-router';
import { loggingMiddleware } from './domains/logging/middleware';
import { errorsMiddleware } from './errors-middleware';
import { commentUpvotesRouter } from './routers/comment-upvotes-router';
import { commentsRouter } from './routers/comments-router';
import { postUpvotesRouter } from './routers/post-upvotes-router';
import { postsRouter } from './routers/posts-router';
import { searchRouter } from './routers/search-router';
import { usersRouter } from './routers/users-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .middleware(loggingMiddleware)
  .middleware(errorsMiddleware)
  .merge('user.', usersRouter)
  .merge('search.', searchRouter)
  .merge('post.', postsRouter)
  .merge('post.upvote.', postUpvotesRouter)
  .merge('comment.', commentsRouter)
  .merge('comment.upvote.', commentUpvotesRouter);

export type AppRouter = typeof appRouter;
