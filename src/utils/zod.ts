import { z } from "zod"

export const postSchema = z.object({
  title: z
    .string()
    .min(10, {
      message: "Title is too short. (At least 10 characters).",
    })
    .max(100, {
      message: "Title is too long. Please keep it under 100 characters.",
    }),
  content: z
    .string()
    .min(50, {
      message: "Content is too short. (At least 50 characters).",
    })
    .max(1000, {
      message: "Content is too long. Please keep it under 1000 characters.",
    }),
  community: z.string().min(1, {
    message: "Please select a community.",
  }),
  topics: z
    .array(z.string())
    .max(12, {
      message: "You can only have up to 12 topics in a post.",
    })
    .optional(),
})

export const commentSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Comment is too short. (At least 10 characters).",
    })
    .max(500, {
      message: "Comment is too long. Please keep it under 500 characters.",
    }),
  postId: z.string(),
})

export const communitySchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Name is too short. (At least 5 characters).",
    })
    .max(20, {
      message: "Name is too long. Please keep it under 20 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description is too short. (At least 10 characters).",
    })
    .max(120, {
      message: "Description is too long. Please keep it under 120 characters.",
    }),
})
