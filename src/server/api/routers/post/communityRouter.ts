import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const communityRouter = createTRPCRouter({
  getTrending: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        community: {
          name: input,
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          // last 7 days
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
  getMostUpvoted: publicProcedure.input(z.string()).query(({ ctx, input }) => {
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
          comments: {
            _count: "desc",
          },
        },
      })
    }),
})
