import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

import type { PrismaClient } from "@prisma/client"

export const getCommunityByName = ({
  prisma,
  name,
}: {
  prisma: PrismaClient
  name: string
}) => {
  return prisma.community.findUnique({
    where: {
      name,
    },
  })
}

export const communityRouter = createTRPCRouter({
  getTrending: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.community.findMany({
      orderBy: {
        members: {
          _count: "desc",
        },
      },
      take: 10,
    })
  }),
  getByName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return getCommunityByName({
      prisma: ctx.prisma,
      name: input,
    })
  }),
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
})
