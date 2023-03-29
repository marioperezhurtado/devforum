import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

export const commentRouter = createTRPCRouter({
  getByPostId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.comment.findMany({
      where: {
        postId: input,
      },
      include: {
        creator: true,
        reactions: true,
      },
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(5).max(500),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          post: {
            connect: {
              id: input.postId,
            },
          },
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      })
    }),
  reply: protectedProcedure
    .input(
      z.object({
        content: z.string().min(5).max(500),
        postId: z.string(),
        replyToId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          post: {
            connect: {
              id: input.postId,
            },
          },
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          replyTo: {
            connect: {
              id: input.replyToId,
            },
          },
        },
      })
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input,
        },
        include: {
          creator: true,
        },
      })
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        })
      }
      if (comment.creator.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the creator of this comment",
        })
      }
      return ctx.prisma.comment.delete({
        where: {
          id: input,
        },
      })
    }),
})
