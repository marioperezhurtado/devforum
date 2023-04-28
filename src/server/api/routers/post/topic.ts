import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const topicRouter = createTRPCRouter({
  getTrending: publicProcedure.input(z.string()).query(({ ctx, input }) => {
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
      orderBy: [
        {
          reactions: {
            _count: "desc",
          },
        },
        { createdAt: "desc" },
      ],
    })
  }),
  getLatest: publicProcedure.input(z.string()).query(({ ctx, input }) => {
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
      orderBy: {
        createdAt: "desc",
      },
    })
  }),
  getMostUpvoted: publicProcedure.input(z.string()).query(({ ctx, input }) => {
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
      orderBy: {
        reactions: {
          _count: "desc",
        },
      },
    })
  }),
  getControversial: publicProcedure
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
        orderBy: {
          reactions: {
            _count: "desc",
          },
        },
      })
    }),
})
