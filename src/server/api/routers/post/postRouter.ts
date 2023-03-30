import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { communityRouter } from "./communityRouter"
import { topicRouter } from "./topicRouter"

export const postRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input,
      },
      include: {
        creator: true,
        community: true,
        topics: true,
        reactions: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }),
  getFeatured: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        creator: true,
        community: true,
        topics: true,
        reactions: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }),
  community: communityRouter,
  topic: topicRouter,
})
