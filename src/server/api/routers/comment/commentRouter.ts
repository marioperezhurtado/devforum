import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc"

export const commentRouter = createTRPCRouter({
  getByPostId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.comment.findMany({
      where: {
        postId: input,
      },
      include: {
        creator: true,
      },
    })
  }),
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(5).max(500),
        postId: z.string(),
        replyToId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          replyToId: input.replyToId,
          creatorId: ctx.session.user.id,
        },
      })
    }),
})
