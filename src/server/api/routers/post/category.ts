import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { categorySchema } from "@/utils/zod"

export const categoryRouter = createTRPCRouter({
  getTrending: publicProcedure.input(categorySchema).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        category: input,
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
  getLatest: publicProcedure.input(categorySchema).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        category: input,
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
  getMostUpvoted: publicProcedure
    .input(categorySchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          category: input,
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
    .input(categorySchema)
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          category: input,
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
