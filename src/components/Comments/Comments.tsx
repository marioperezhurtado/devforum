import type { RouterOutputs } from "@/utils/api"

import CommentItem, {
  CommentSkeleton,
} from "@/components/CommentItem/CommentItem"

type Comments = RouterOutputs["comment"]["getByPostId"]

export default function CommentList({ comments }: { comments: Comments }) {
  const rootComments = comments.filter((comment) => !comment.replyToId)

  return (
    <ul className="flex flex-col gap-4">
      {rootComments.map((c) => (
        <li key={c.id}>
          <CommentItem comment={c} allComments={comments} />
        </li>
      ))}
    </ul>
  )
}

export function CommentsSkeleton() {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-32 rounded-full bg-zinc-100" />
          <div className="h-4 w-24 rounded-full bg-zinc-100" />
        </div>
        <div className="h-8 w-40 rounded-full bg-zinc-100" />
      </div>
      <div className="flex flex-col gap-4">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    </>
  )
}
