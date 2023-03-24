import { createTRPCRouter } from "@/server/api/trpc"
import { communityRouter } from "./routers/community/communityRouter"
import { postRouter } from "./routers/post/postRouter"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  community: communityRouter,
  post: postRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
