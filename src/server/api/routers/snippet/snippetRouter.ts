import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const snippetRouter = createTRPCRouter({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.codeSnippet.findUnique({
      where: {
        id: input,
      },
    })
  }),
})
