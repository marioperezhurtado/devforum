import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const communityRouter = createTRPCRouter({
  getAllByMember: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.community.findMany({
      where: {
        members: {
          some: {
            id: input,
          },
        },
      },
    })
  }),
  getTop: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.community.findMany({
      orderBy: {
        members: {
          _count: "desc",
        },
      },
      take: 10,
    })
  }),
})
