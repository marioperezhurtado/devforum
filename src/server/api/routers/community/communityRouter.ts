import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const communityRouter = createTRPCRouter({
  getAllByMember: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const memberCommunities = await ctx.prisma.community.findMany({
        where: {
          members: {
            some: {
              id: input,
            },
          },
        },
      })
      return memberCommunities
    }),
  getTop: publicProcedure.query(async ({ ctx }) => {
    const topCommunities = await ctx.prisma.community.findMany({
      orderBy: {
        members: {
          _count: "desc",
        },
      },
      take: 10,
    })
    return topCommunities
  }),
})
