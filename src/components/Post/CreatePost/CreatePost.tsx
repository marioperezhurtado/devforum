import { useState } from "react"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useForm, useWatch } from "react-hook-form"
import { useSnippetsStore } from "@/components/CodeSnippet/CreateSnippets/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/utils/zod"
import { toast } from "react-hot-toast"

import Button from "@/ui/Button"
import FormError from "@/ui/FormError"
import CreateSnippets from "@/components/CodeSnippet/CreateSnippets/CreateSnippets"
import Image from "next/image"

import type { z } from "zod"

const categories = [
  "Discussions",
  "News",
  "HelpNeeded",
  "Jobs",
  "Showcase",
  "Tutorials",
  "Resources",
]

export default function CreatePost() {
  const router = useRouter()
  const { data: session } = useSession()
  const [snippetsOpen, setSnippetsOpen] = useState(false)
  const [linksOpen, setLinksOpen] = useState(false)
  const snippets = useSnippetsStore((state) => state.snippets)

  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSuccess: () => reset(),
  })
  const { data: myCommunities } = api.community.getAllByMember.useQuery(
    session?.user.id ?? "",
    {
      refetchOnWindowFocus: false,
      enabled: !!session,
    }
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
  })

  const content = useWatch({
    control,
    name: "content",
    defaultValue: "",
  })
  const getTopics = (content: string) =>
    content.match(/#\w+/g)?.map((t) => t.slice(1)) ?? []

  const onSubmit = handleSubmit(async (data) => {
    try {
      const createdPost = await toast.promise(
        createPost({
          topics: getTopics(data.content),
          codeSnippets: snippetsOpen ? snippets : [],
          demoUrl: data.demoUrl ?? undefined,
          ...data,
        }),
        {
          loading: "Creating post...",
          success: "Post created! 💫",
          error: "Failed to create post",
        }
      )
      await router.push(`/post/${createdPost.id}`)
    } catch (e) {}
  })

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      name="createPost"
      className="rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4"
    >
      <div className="mb-2">
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          placeholder="An awesome title for your post"
          className="mb-2 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-sky-600 md:px-4 md:py-2"
        />
        {errors.title?.message && <FormError message={errors.title.message} />}
      </div>
      <div className="mb-2">
        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <textarea
          id="content"
          {...register("content")}
          placeholder="Start writing here..."
          className="h-44 w-full rounded-md border bg-zinc-50 px-2 py-1  focus:outline-sky-600 md:px-4 md:py-2"
        />
        {errors.content?.message && (
          <FormError message={errors.content.message} />
        )}
      </div>
      {getTopics(content).length > 0 && (
        <p className="my-4 text-sm font-semibold">
          #{getTopics(content)?.join(", #") ?? ""}
        </p>
      )}
      <div className="my-4">
        <label htmlFor="community" className="sr-only">
          Community
        </label>
        <select
          id="community"
          {...register("community")}
          defaultValue=""
          className="mb-2 rounded-md border bg-zinc-50 px-2 py-1 text-sm focus:outline-sky-600 md:py-2"
        >
          <option value="" disabled>
            Select a community
          </option>
          {myCommunities?.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        {errors.community?.message && (
          <FormError message={errors.community.message} />
        )}
        <label htmlFor="category" className="sr-only">
          Category
        </label>
        <select
          id="category"
          {...register("category")}
          defaultValue=""
          className="my-2 block rounded-md border bg-zinc-50 px-2 py-1 text-sm focus:outline-sky-600 md:py-2"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories?.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        {errors.category?.message && (
          <FormError message={errors.category.message} />
        )}
      </div>
      {errors.topics?.message && <FormError message={errors.topics.message} />}
      {snippetsOpen && <CreateSnippets />}

      {linksOpen && (
        <section className="mt-2 flex max-w-sm flex-col gap-2">
          <div className="relative">
            <Image
              src="/icons/safari.svg"
              alt="Live Demo"
              width={16}
              height={16}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="demoUrl" className="sr-only">
              Live Demo URL
            </label>
            <input
              id="demoUrl"
              {...register("demoUrl")}
              placeholder="https://your-live-demo.com"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
          <div className="relative">
            <Image
              src="/icons/github-color.svg"
              alt="Github Repo"
              width={24}
              height={24}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="githubUrl" className="sr-only">
              Github Repo URL
            </label>
            <input
              id="githubUrl"
              {...register("githubUrl")}
              placeholder="https://github.com"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
          <div className="relative">
            <Image
              src="/icons/discord-color.svg"
              alt="Discord"
              width={20}
              height={20}
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="discordUrl" className="sr-only">
              Discord URL
            </label>
            <input
              id="discordUrl"
              {...register("discordUrl")}
              placeholder="https://discord.gg"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
          <div className="relative">
            <Image
              src="/icons/twitter-color.svg"
              alt="Twitter"
              width={20}
              height={20}
              className="absolute right-1.5 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="twitterUrl" className="sr-only">
              Twitter URL
            </label>
            <input
              id="twitterUrl"
              {...register("twitterUrl")}
              placeholder="https://twitter.com"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
          <div className="relative">
            <Image
              src="/icons/reddit-color.svg"
              alt="Reddit"
              width={24}
              height={24}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="redditUrl" className="sr-only">
              Reddit URL
            </label>
            <input
              id="redditUrl"
              {...register("redditUrl")}
              placeholder="https://reddit.com"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
          <div className="relative">
            <Image
              src="/icons/youtube-color.svg"
              alt="Youtube"
              width={24}
              height={24}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            />
            <label htmlFor="youtubeUrl" className="sr-only">
              Youtube URL
            </label>
            <input
              id="youtubeUrl"
              {...register("youtubeUrl")}
              placeholder="https://youtube.com"
              className="w-full rounded-md border bg-zinc-50 px-2 py-1 pr-8 focus:outline-sky-600"
            />
          </div>
        </section>
      )}

      <div className="mb-2 mt-4 flex gap-2">
        {!snippetsOpen && (
          <Button
            onClick={() => setSnippetsOpen(true)}
            type="button"
            size="small"
            className="flex gap-1.5"
          >
            <span>+</span>Code snippets
          </Button>
        )}
        {!linksOpen && (
          <Button
            onClick={() => setLinksOpen(true)}
            type="button"
            size="small"
            className="flex gap-1.5"
          >
            <span>+</span>Social links
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end gap-1.5 md:mt-2 md:gap-4">
        <Button onClick={() => void reset()} type="button" intent="secondary">
          Reset
        </Button>
        <Button type="submit" authRequired>
          Create post
        </Button>
      </div>
    </form>
  )
}
