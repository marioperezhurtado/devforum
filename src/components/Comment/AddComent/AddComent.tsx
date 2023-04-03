import { useRef, useEffect } from "react"
import { api } from "@/utils/api"
import { useCommentStore } from "@/pages/post/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { commentSchema } from "@/utils/zod"
import toast from "react-hot-toast"

import Image from "next/image"
import Button from "@/ui/Button"
import FormError from "@/ui/FormError"

import type { z } from "zod"

type Props = {
  postId: string
  onClose: () => void
}

export default function AddComment({ postId, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const { replyTo } = useCommentStore()

  const utils = api.useContext()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const success = async () => {
    await utils.comment.getByPostId.invalidate(postId)
    handleClose()
  }

  const { mutateAsync: addComment } = api.comment.create.useMutation({
    onSuccess: async () => success(),
  })
  const { mutateAsync: addReply } = api.comment.reply.useMutation({
    onSuccess: async () => success(),
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (replyTo) {
        await toast.promise(
          addReply({
            postId: data.postId,
            content: data.content,
            replyToId: replyTo.id,
          }),
          {
            loading: "Adding reply...",
            success: "Reply added! 🗣️",
            error: "Failed to add reply",
          }
        )
        return
      }
      await toast.promise(addComment({ postId, content: data.content }), {
        loading: "Adding comment...",
        success: "Comment added! 💬",
        error: "Failed to add comment",
      })
    } catch (e) {}
  })

  useEffect(() => {
    if (!replyTo) return
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [replyTo])

  return (
    <form
      ref={formRef}
      onSubmit={(e) => void onSubmit(e)}
      name="addComent"
      id="addComment"
      className="mb-5 rounded-md border bg-white p-2 shadow-md md:mb-10 md:p-4"
    >
      {replyTo && (
        <div className="mb-1 flex items-center gap-1 md:mb-2">
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
      <label htmlFor="content" className="sr-only">
        Leave a comment, answer a question or share your thoughts...
      </label>
      <textarea
        id="content"
        {...register("content")}
        placeholder="Leave a comment, answer a question or share your thoughts..."
        className="h-44 w-full rounded-md border bg-zinc-50 px-2 py-1  focus:outline-sky-600 md:py-2 md:px-4"
      />
      {errors.content?.message && (
        <FormError message={errors.content.message} />
      )}
      <input className="sr-only" value={postId} {...register("postId")} />
      <div className="flex items-center justify-end gap-1.5 md:mt-2 md:gap-4">
        <Button onClick={handleClose} type="button" intent="secondary">
          Cancel
        </Button>

        <Button type="submit" authRequired>
          {replyTo ? "Add reply" : "Add comment"}
        </Button>
      </div>
    </form>
  )
}
