import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const postReactionRouter = createTRPCRouter({
  addOrUpdate: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        vote: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.postReaction.upsert({
        where: {
          postReactionCreatorIdPostId: {
            creatorId: ctx.session.user.id,
            postId: input.postId,
          },
        },
        update: {
          vote: input.vote,
        },
        create: {
          vote: input.vote,
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
  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    return ctx.prisma.postReaction.delete({
      where: {
        postReactionCreatorIdPostId: {
          creatorId: ctx.session.user.id,
          postId: input,
        },
      },
    })
  }),
})
