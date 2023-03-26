import type { RouterOutputs } from "@/utils/api"

import CommentItem from "@/components/CommentItem/CommentItem"
import Button from "@/ui/Button"

type Comments = RouterOutputs["comment"]["getByPostId"]

export default function CommentList({ comments }: { comments: Comments }) {
  const rootComments = comments.filter((comment) => !comment.replyToId)

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Comments</h2>
          <p className="text-sm text-gray-500">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button>Leave a comment</Button>
      </div>
      <ul className="flex flex-col gap-4">
        {rootComments.map((c) => (
          <li key={c.id}>
            <CommentItem comment={c} allComments={comments} />
          </li>
        ))}
      </ul>
    </>
  )
}
