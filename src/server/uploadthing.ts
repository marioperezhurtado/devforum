import {
  createUploadthing,
  type FileRouter as TFileRouter,
} from "uploadthing/next-legacy"

import { getServerAuthSession } from "@/server/auth"
import { prisma } from "./db"

const f = createUploadthing()

export const fileRouter = {
  avatar: f
    .fileTypes(["image"])
    .maxSize("2MB")
    .middleware(async (req, res) => {
      const session = await getServerAuthSession({ req, res })

      if (!session?.user) throw new Error("Unauthorized")

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      })
    }),
  banner: f
    .fileTypes(["image"])
    .maxSize("2MB")
    .middleware(async (req, res) => {
      const session = await getServerAuthSession({ req, res })

      if (!session?.user) throw new Error("Unauthorized")

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: { id: metadata.userId },
        data: { banner: file.url },
      })
    }),
} satisfies TFileRouter

export type FileRouter = typeof fileRouter
