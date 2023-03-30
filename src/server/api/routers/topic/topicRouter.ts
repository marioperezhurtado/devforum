import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

import type { PrismaClient } from "@prisma/client"

export const getTopicByName = ({
  prisma,
  name,
}: {
  prisma: PrismaClient
  name: string
}) => {
  return prisma.topic.findUnique({
    where: {
      name,
    },
  })
}

export const topicRouter = createTRPCRouter({
  getByName: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return getTopicByName({
      prisma: ctx.prisma,
      name: input,
    })
  }),
  getPopular: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.topic.findMany({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    })
  }),
})
