import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/utils/zod"
import { toast } from "react-hot-toast"

import Button from "@/ui/Button"
import FormError from "@/ui/FormError"

import type { z } from "zod"

export default function CreatePost() {
  const router = useRouter()
  const { data: session } = useSession()

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
          title: data.title,
          content: data.content,
          community: data.community,
          topics: getTopics(data.content),
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
          className="mb-2 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-sky-600 md:py-2 md:px-4"
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
          className="h-44 w-full rounded-md border bg-zinc-50 px-2 py-1  focus:outline-sky-600 md:py-2 md:px-4"
        />
        {errors.content?.message && (
          <FormError message={errors.content.message} />
        )}
      </div>
      <div className="mb-2">
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
      </div>
      {getTopics(content).length > 0 && (
        <p className="mt-2 text-sm font-semibold">
          #{getTopics(content)?.join(", #") ?? ""}
        </p>
      )}
      {errors.topics?.message && <FormError message={errors.topics.message} />}
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
