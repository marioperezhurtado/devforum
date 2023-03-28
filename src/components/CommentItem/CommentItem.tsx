import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useSession } from "next-auth/react"
import { api } from "@/utils/api"
import { useCommentStore } from "@/pages/post/store"

import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"
type Comment = RouterOutputs["comment"]["getByPostId"][0]

dayjs.extend(relativeTime)

export default function CommentItem({
  comment,
  allComments,
}: {
  comment: Comment
  allComments: Comment[]
}) {
  const { data: session } = useSession()
  const { reply } = useCommentStore()

  const utils = api.useContext()

  const { mutate: handleDelete, isLoading: isDeleting } =
    api.comment.delete.useMutation({
      onSuccess: async () => {
        await utils.comment.getByPostId.invalidate(comment.postId)
      },
    })

  const replies = allComments.filter((c) => c.replyToId === comment.id)
  const isOwn = comment.creator.id === session?.user.id

  return (
    <>
      <div className="relative overflow-hidden rounded-md border bg-white shadow-md">
        <div className="flex items-center gap-2 px-2 py-4">
          <Image
            src={comment.creator.image ?? ""}
            alt={
              comment.creator.name
                ? `${comment.creator.name}'s profile picture`
                : ""
            }
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm">{comment.creator.name}</span>
          <span className="text-xs text-gray-500">
            · {dayjs(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="px-2">{comment.content}</p>
        <div className="mt-2 flex items-center gap-1 border-t  bg-zinc-50 p-1">
          <button className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200">
            <Image
              src="/icons/upvote.svg"
              alt="Upvote"
              width={14}
              height={14}
            />
          </button>
          <button className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200">
            <Image
              src="/icons/downvote.svg"
              alt="Downvote"
              width={14}
              height={14}
            />
          </button>
          <div className="ml-auto flex gap-1">
            {isOwn && (
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(comment.id)}
                className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200"
              >
                <Image
                  src="/icons/delete.svg"
                  alt="Delete"
                  width={14}
                  height={14}
                />
                Delete
              </button>
            )}
            <button
              onClick={() => reply(comment)}
              className="ml-auto flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200"
            >
              <Image
                src="/icons/comment.svg"
                alt="Reply"
                width={14}
                height={14}
              />
              Reply
            </button>
          </div>
        </div>
      </div>
      {!!replies?.length && (
        <ul className="relative ml-8 mt-2 flex flex-col gap-4">
          <NestedLine />
          {replies.map((reply) => (
            <li key={reply.id}>
              <CommentItem comment={reply} allComments={allComments} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function NestedLine() {
  return (
    <span className="absolute -left-4 top-0 h-full w-0.5 rounded-full bg-zinc-300" />
  )
}

export function CommentSkeleton() {
  return (
    <div className="relative animate-pulse overflow-hidden rounded-md border bg-white shadow-md">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="h-6 w-6 rounded-full bg-zinc-100" />
        <div className="h-4 w-36 rounded-full bg-zinc-100" />
        <div className="h-3 w-14 rounded-full bg-zinc-100" />
      </div>
      <div className="mx-2 h-4 rounded-full bg-zinc-100" />
      <div className="mx-2 mt-2 h-4 w-3/4 rounded-full bg-zinc-100" />
      <div className="mt-3 h-7 bg-zinc-100" />
    </div>
  )
}
