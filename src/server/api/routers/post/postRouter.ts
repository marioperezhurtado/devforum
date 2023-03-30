import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc"
import { communityRouter } from "./communityRouter"
import { topicRouter } from "./topicRouter"
import { TRPCError } from "@trpc/server"

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
  community: communityRouter,
  topic: topicRouter,
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        community: z.string(),
        topics: z.array(z.string()).max(8).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          communities: {
            select: {
              name: true,
            },
          },
        },
      })
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        })
      }

      const isJoined = user.communities.find(
        (community) => community.name === input.community
      )
      if (!isJoined) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You are not a member of this community",
        })
      }

      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          community: {
            connect: {
              name: input.community,
            },
          },
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          topics: {
            connectOrCreate: input.topics?.map((n) => ({
              where: { name: n },
              create: { name: n },
            })),
          },
        },
      })
    }),
})
