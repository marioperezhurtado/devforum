import { useRef } from "react"
import { z } from "zod"
import { api } from "@/utils/api"

import Button from "@/ui/Button"

type Props = {
  postId: string
  onClose: () => void
}

export default function AddComment({ postId, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const utils = api.useContext()

  const { mutate } = api.comment.create.useMutation({
    onSuccess: async () => {
      await utils.comment.getByPostId.invalidate(postId)
      onClose()
      formRef.current?.reset()
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const schema = z.object({
      comment: z.string().min(1).max(500),
      replyToId: z.string().optional(),
    })

    try {
      const comment = e.currentTarget.comment as HTMLInputElement
      schema.parse({
        comment: comment.value,
      })
      mutate({ postId, content: comment.value })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      name="addComent"
      className="mb-10 rounded-md border bg-white p-4 shadow-md"
    >
      <label htmlFor="comment" className="sr-only">
        Leave a comment, answer a question or share your thoughts...
      </label>
      <textarea
        id="comment"
        name="comment"
        placeholder="Leave a comment, answer a question or share your thoughts..."
        className="h-44 w-full rounded-md border bg-zinc-50 p-4 focus:outline-sky-600"
      />
      <div className="mt-5 flex items-center justify-end gap-4">
        <Button onClick={onClose} type="button" intent="secondary">
          Cancel
        </Button>
        <Button type="submit">Add comment</Button>
      </div>
    </form>
  )
}
