import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

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
          reactions: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    }),
  getLatestByTopic: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          topics: {
            some: {
              name: input,
            },
          },
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
})
