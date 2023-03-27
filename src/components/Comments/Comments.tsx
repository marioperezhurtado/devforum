import type { RouterOutputs } from "@/utils/api"

import CommentItem from "@/components/CommentItem/CommentItem"

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
