import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"

import { communitySchema } from "@/utils/zod"

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
  create: protectedProcedure
    .input(communitySchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.community.create({
        data: {
          name: input.name,
          description: input.description,
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          members: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
    }),
})
