import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc"
import { communityRouter } from "./community"
import { topicRouter } from "./topic"
import { userRouter } from "./user"
import { categoryRouter } from "./category"
import { TRPCError } from "@trpc/server"

import { postSchema } from "@/utils/zod"

export const postRouter = createTRPCRouter({
  community: communityRouter,
  topic: topicRouter,
  user: userRouter,
  category: categoryRouter,
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
        codeSnippets: true,
        _count: {
          select: {
            comments: true,
            reactions: true,
          },
        },
      },
    })
  }),
  searchByTitlePreview: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findMany({
        where: {
          title: {
            contains: input,
          },
        },
        orderBy: {
          reactions: {
            _count: "desc",
          },
        },
        take: 5,
      })
    }),
  searchByTitle: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findMany({
      where: {
        title: {
          contains: input,
        },
      },
      orderBy: {
        reactions: {
          _count: "desc",
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
      take: 50,
    })
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
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
      orderBy: {
        createdAt: "desc",
      },
    })
  }),
  create: protectedProcedure
    .input(postSchema)
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
          code: "FORBIDDEN",
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
            connectOrCreate: input.topics?.map((t) => ({
              where: { name: t },
              create: { name: t },
            })),
          },
          codeSnippets: {
            create: input.codeSnippets?.map((s) => ({
              filename: s.filename,
              code: s.code,
              language: s.language,
            })),
          },
          category: input.category,
          demoUrl: input.demoUrl,
          githubUrl: input.githubUrl,
          discordUrl: input.discordUrl,
          twitterUrl: input.twitterUrl,
          redditUrl: input.redditUrl,
          youtubeUrl: input.youtubeUrl,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input,
        },
        include: {
          creator: true,
        },
      })
      if (!post) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Post not found",
        })
      }
      if (post.creator.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the creator of this post",
        })
      }

      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      })
    }),
})
