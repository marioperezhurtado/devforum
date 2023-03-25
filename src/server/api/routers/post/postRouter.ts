import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const postRouter = createTRPCRouter({
  getFeatured: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        creator: true,
        community: true,
        topics: true,
      },
    })
  }),
  getLatestByCommunityName: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          community: {
            name: input,
          },
        },
        include: {
          creator: true,
          community: true,
          topics: true,
        },
      })
    }),
})
