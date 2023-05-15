import { z } from "zod"

export const categorySchema = z.enum(
  [
    "discussions",
    "news",
    "help",
    "jobs",
    "showcase",
    "tutorials",
    "resources",
    "others",
  ],
  {
    errorMap: () => ({ message: "Please select a valid category" }),
  }
)

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
  category: categorySchema,
  topics: z
    .array(z.string())
    .max(12, {
      message: "You can only have up to 12 topics in a post.",
    })
    .optional(),
  codeSnippets: z
    .array(
      z.object({
        filename: z.string(),
        code: z.string(),
        language: z.enum([
          "JavaScript",
          "TypeScript",
          "Python",
          "Go",
          "Rust",
          "Java",
          "C",
          "Cpp",
          "CSharp",
          "JSX",
          "TSX",
        ]),
      })
    )
    .optional(),
  demoUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  discordUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  redditUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
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
    .max(150, {
      message: "Description is too long. Please keep it under 150 characters.",
    }),
  color: z
    .string()
    .length(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, {
      message: "Select a valid hexadecimal color.",
    }), // #000000 - #ffffff
})

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Name is too short. (At least 5 characters).",
    })
    .max(30, {
      message: "Name is too long. Please keep it under 30 characters.",
    }),
  bio: z
    .string()
    .min(10, {
      message: "Bio is too short. (At least 10 characters).",
    })
    .max(150, {
      message: "Bio is too long. Please keep it under 150 characters.",
    }),
})
