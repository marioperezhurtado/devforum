import { useRef, useState } from "react"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { z } from "zod"
import { toast } from "react-hot-toast"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Link from "next/link"
import Button from "@/ui/Button"

export default function CreatePost() {
  const router = useRouter()
  const { data: session } = useSession()
  const formRef = useRef<HTMLFormElement>(null)
  const [content, setContent] = useState("")

  const getTopics = (content: string) =>
    content.match(/#\w+/g)?.map((t) => t.slice(1))

  const { mutateAsync: createPost } = api.post.create.useMutation({
    onSuccess: () => {
      formRef.current?.reset()
      setContent("")
    },
  })
  const { data: myCommunities } = api.community.getAllByMember.useQuery(
    session?.user.id ?? ""
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!session) await router.push("/signIn")

    const schema = z.object({
      title: z.string().min(1).max(100),
      content: z.string().min(1).max(1000),
      topics: z.array(z.string()).optional(),
    })

    try {
      const titleInput = e.currentTarget.postTitle as HTMLInputElement
      const topics = getTopics(content)

      schema.parse({
        title: titleInput.value,
        content: content,
        topics,
      })

      const createdPost = await toast.promise(
        createPost({
          title: titleInput.value,
          content,
          community: "TestCommunity",
          topics: topics,
        }),
        {
          loading: "Creating post...",
          success: "Post created! 💫",
          error: "Failed to create post",
        }
      )

      await router.push(`/post/${createdPost.id}`)
    } catch (e) {}
  }

  return (
    <ForumLayout
      title="Create a post - DevForum.dev"
      description="Everyone has something valuable to say.Take the plunge and share anything you want with other developers.
      "
    >
      <div className="mb-5 rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4">
        <p className="mb-5 text-xl font-semibold">
          Everyone has something valuable to say.
        </p>
        <p className="mb-3">
          Dive in and share anything you want with other developers.
        </p>
        <p>
          Share your knowledge, ask for help, rant about your projects and
          passions, or just say hi. Be yourself and have fun!
        </p>

        <p className="mt-8 text-right text-sm">
          Please be respectful and follow the{" "}
          <Link
            href="#"
            className="transiton text-sky-600 underline hover:text-sky-500"
          >
            community guidelines.
          </Link>
        </p>
      </div>
      <form
        ref={formRef}
        onSubmit={(e) => void handleSubmit(e)}
        name="createPost"
        className="rounded-md border bg-white px-2 py-3 shadow-md md:px-6 md:py-4"
      >
        <label htmlFor="postTitle" className="sr-only">
          Title
        </label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          placeholder="An awesome title for your post"
          className="mb-2 w-full rounded-md border bg-zinc-50 px-2 py-1 focus:outline-sky-600 md:py-2 md:px-4"
        />
        <label htmlFor="content" className="sr-only">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing here..."
          className="h-44 w-full rounded-md border bg-zinc-50 px-2 py-1  focus:outline-sky-600 md:py-2 md:px-4"
        />
        <label htmlFor="community" className="sr-only">
          Community
        </label>
        <select
          id="community"
          name="community"
          className="rounded-md border bg-zinc-50 px-2 py-1 text-sm focus:outline-sky-600 md:py-2"
        >
          {myCommunities?.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
        {getTopics(content) && (
          <p className="mt-2 text-sm font-semibold">
            #{getTopics(content)?.join(", #") ?? ""}
          </p>
        )}
        <div className="flex items-center justify-end gap-1.5 md:mt-2 md:gap-4">
          <Button
            onClick={() => formRef?.current?.reset()}
            type="button"
            intent="secondary"
          >
            Reset
          </Button>
          <Button type="submit">Create post</Button>
        </div>
      </form>
    </ForumLayout>
  )
}
