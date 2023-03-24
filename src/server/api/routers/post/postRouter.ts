import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const postRouter = createTRPCRouter({
  getFeatured: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        creator: true,
        community: true,
        topics: true,
      },
    })
  }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(10).max(120),
        content: z.string().min(100).max(1000),
        communityId: z.string(),
        creatorId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          community: {
            connect: {
              id: input.communityId,
            },
          },
          creator: {
            connect: {
              id: input.creatorId,
            },
          },
        },
      })
    }),
})
