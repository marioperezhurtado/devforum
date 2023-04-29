import { createTRPCRouter } from "@/server/api/trpc"
import { communityRouter } from "./routers/community/communityRouter"
import { postRouter } from "./routers/post/postRouter"
import { topicRouter } from "./routers/topic/topicRouter"
import { commentRouter } from "./routers/comment/commentRouter"
import { postReactionRouter } from "./routers/postReaction/postReactionRouter"
import { commentReactionRouter } from "./routers/commentReaction/commentReactionRouter"
import { snippetRouter } from "./routers/snippet/snippetRouter"
import { userRouter } from "./routers/user/userRouter"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  community: communityRouter,
  post: postRouter,
  topic: topicRouter,
  comment: commentRouter,
  postReaction: postReactionRouter,
  commentReaction: commentReactionRouter,
  snippet: snippetRouter,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

import { createServerSideHelpers } from "@trpc/react-query/server"
import { createInnerTRPCContext } from "@/server/api/trpc"
import superjson from "superjson"

// SSG SSR helpers
export const ssg = createServerSideHelpers({
  router: appRouter,
  ctx: createInnerTRPCContext({ session: null }),
  transformer: superjson,
})
