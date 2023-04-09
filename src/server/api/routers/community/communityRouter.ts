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
  getTrendingPreview: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.community.findMany({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
      take: 5,
    })
  }),
  getTrending: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.community.findMany({
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    })
  }),
  getDiscoverPreview: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.community.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
      const name = input.name // test name -> TestName
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")

      return ctx.prisma.community.create({
        data: {
          name,
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
  join: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.community.update({
      where: {
        name: input,
      },
      data: {
        members: {
          connect: {
            id: ctx.session.user.id,
          },
        },
      },
    })
  }),
  leave: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.community.update({
      where: {
        name: input,
      },
      data: {
        members: {
          disconnect: {
            id: ctx.session.user.id,
          },
        },
      },
    })
  }),
})
