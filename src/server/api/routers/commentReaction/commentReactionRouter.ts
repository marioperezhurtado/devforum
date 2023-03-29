import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const commentReactionRouter = createTRPCRouter({
  addOrUpdate: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        vote: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.commentReaction.upsert({
        where: {
          commentReactionCreatorIdCommentId: {
            creatorId: ctx.session.user.id,
            commentId: input.commentId,
          },
        },
        update: {
          vote: input.vote,
        },
        create: {
          vote: input.vote,
          comment: {
            connect: {
              id: input.commentId,
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
    return ctx.prisma.commentReaction.delete({
      where: {
        commentReactionCreatorIdCommentId: {
          creatorId: ctx.session.user.id,
          commentId: input,
        },
      },
    })
  }),
})
