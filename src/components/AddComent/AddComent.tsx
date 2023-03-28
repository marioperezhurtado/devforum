import { useRef, useEffect } from "react"
import { z } from "zod"
import { api } from "@/utils/api"
import { useCommentStore } from "@/pages/post/store"
import toast from "react-hot-toast"

import Image from "next/image"
import Button from "@/ui/Button"

type Props = {
  postId: string
  onClose: () => void
}

export default function AddComment({ postId, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const { replyTo } = useCommentStore()

  const utils = api.useContext()

  const { mutateAsync: addComment } = api.comment.create.useMutation({
    onSuccess: async () => {
      await utils.comment.getByPostId.invalidate(postId)
      onClose()
      formRef.current?.reset()
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const schema = z.object({
      comment: z.string().min(1).max(500),
      replyToId: z.string().optional(),
    })

    try {
      const commentInput = e.currentTarget.comment as HTMLInputElement
      const { comment, replyToId } = schema.parse({
        comment: commentInput.value,
        replyToId: replyTo?.id,
      })
      await toast.promise(addComment({ postId, content: comment, replyToId }), {
        loading: "Adding comment...",
        success: "Comment added! ✨",
        error: "Failed to add comment",
      })
    } catch (e) {}
  }

  useEffect(() => {
    if (!replyTo) return
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [replyTo])

  return (
    <form
      ref={formRef}
      onSubmit={(e) => void handleSubmit(e)}
      name="addComent"
      id="addComment"
      className="mb-10 rounded-md border bg-white p-4 shadow-md"
    >
      {replyTo && (
        <div className="mb-2 flex items-center gap-1">
          <Image
            src="/icons/reply.svg"
            alt="Add a reply"
            width={16}
            height={16}
          />
          <p className="text-sm text-gray-500">
            Replying to
            <span className="mr-1.5 font-semibold text-gray-700">
              {" "}
              {replyTo.creator.name}
            </span>
            ·
            <span className="text-gray-500">
              {" "}
              {`"${replyTo.content.slice(0, 25)}${
                replyTo.content.length > 25 ? "..." : ""
              }"`}
            </span>
          </p>
        </div>
      )}
      <label htmlFor="comment" className="sr-only">
        Leave a comment, answer a question or share your thoughts...
      </label>
      <textarea
        id="comment"
        name="comment"
        placeholder="Leave a comment, answer a question or share your thoughts..."
        className="h-44 w-full rounded-md border bg-zinc-50 px-4 py-2 focus:outline-sky-600"
      />
      <div className="mt-2 flex items-center justify-end gap-4">
        <Button onClick={onClose} type="button" intent="secondary">
          Cancel
        </Button>
        <Button type="submit">Add comment</Button>
      </div>
    </form>
  )
}
