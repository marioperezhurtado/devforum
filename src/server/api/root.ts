import { createTRPCRouter } from "@/server/api/trpc"
import { communityRouter } from "./routers/community/communityRouter"
import { postRouter } from "./routers/post/postRouter"
import { topicRouter } from "./routers/topic/topicRouter"
import { commentRouter } from "./routers/comment/commentRouter"
import { postReactionRouter } from "./routers/postReaction/postReactionRouter"
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
})

// export type definition of API
export type AppRouter = typeof appRouter

import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { createInnerTRPCContext } from "@/server/api/trpc"
import superjson from "superjson"

// SSG SSR helpers
export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: createInnerTRPCContext({ session: null }),
  transformer: superjson,
})
