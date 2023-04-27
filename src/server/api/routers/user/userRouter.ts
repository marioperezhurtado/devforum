import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const userRouter = createTRPCRouter({
  getByEmail: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        email: input,
      },
      include: {
        _count: {
          select: {
            posts: true,
            comments: true,
            postReactions: true,
            commentReactions: true,
          },
        },
      },
    })
  }),
})
