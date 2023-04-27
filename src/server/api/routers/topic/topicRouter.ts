import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"

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
  getAllByUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.topic.findMany({
      where: {
        followers: {
          some: {
            id: input,
          },
        },
      },
    })
  }),
  follow: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.topic.update({
      where: {
        name: input,
      },
      data: {
        followers: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    })
  }),
  unfollow: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.topic.update({
      where: {
        name: input,
      },
      data: {
        followers: {
          disconnect: {
            id: ctx.session.user.id,
          },
        },
      },
    })
  }),
})
