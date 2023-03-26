import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

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
})
