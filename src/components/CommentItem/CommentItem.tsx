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
      <div className="rounded-md border bg-white px-6 py-4 shadow-md">
        <div className="mb-5 flex items-center gap-2">
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
        <p>{comment.content}</p>
      </div>
      {!!replies?.length && (
        <ul className="ml-8 mt-2 flex flex-col gap-4">
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
