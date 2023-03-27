import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

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
  const replies = allComments.filter((c) => c.replyToId === comment.id)

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
          <button className="ml-auto flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200">
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
