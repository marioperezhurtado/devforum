import { z } from "zod"
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"

import { updateProfileSchema } from "@/utils/zod"

export const userRouter = createTRPCRouter({
  getByEmail: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        email: input,
      },
      include: {
        _count: {
          select: {
            followers: true,
            posts: true,
            comments: true,
            postReactions: true,
            commentReactions: true,
          },
        },
      },
    })
  }),
  isFollowing: publicProcedure
    .input(
      z.object({
        follower: z.string(),
        followee: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.follower,
        },
        select: {
          following: {
            where: {
              id: input.followee,
            },
          },
        },
      })
    }),
  follow: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    if (input === ctx.session.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can't follow yourself",
      })
    }

    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        following: {
          connect: {
            id: input,
          },
        },
      },
    })
  }),
  unfollow: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    if (input === ctx.session.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can't unfollow yourself",
      })
    }

    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        following: {
          disconnect: {
            id: input,
          },
        },
      },
    })
  }),
  update: protectedProcedure
    .input(updateProfileSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          bio: input.bio,
        },
      })
    }),
})
