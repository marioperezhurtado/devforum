import { api } from "@/utils/api"
import useVote from "@/hooks/useVote"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

import Link from "next/link"
import Image from "next/image"
import Vote from "@/ui/Vote"

import type { RouterOutputs } from "@/utils/api"
type Post = RouterOutputs["post"]["community"]["getLatest"][0]

export default function Actions({ post }: { post: Post }) {
  const { data: session } = useSession()
  const utils = api.useContext()

  const { mutate: handleVote } = api.postReaction.addOrUpdate.useMutation()
  const { mutate: handleRemoveVote } = api.postReaction.delete.useMutation()
  const { mutateAsync: deletePost } = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate()
    },
  })

  const { upvotes, downvotes, handleUpvote, handleDownvote, myVote } = useVote({
    onUpvote: () =>
      handleVote({
        postId: post.id,
        vote: true,
      }),
    onDownvote: () =>
      handleVote({
        postId: post.id,
        vote: false,
      }),
    onRemoveVote: () => handleRemoveVote(post.id),
    votes: post.reactions,
  })

  const handleDelete = async () => {
    try {
      await toast.promise(deletePost(post.id), {
        loading: "Deleting post...",
        success: "Post deleted 🚮",
        error: "Error deleting post",
      })
    } catch (e) {}
  }

  const isOwn = session?.user?.id === post.creatorId

  return (
    <div className="flex gap-1">
      <Link
        href={`/post/${post.id}`}
        className="flex items-center gap-1.5 rounded-full border bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200"
      >
        <Image src="/icons/comment.svg" alt="Comments" width={16} height={16} />
        {post._count?.comments > 0 && post._count?.comments}
      </Link>
      <Vote
        onClick={() => void handleUpvote()}
        voteType="upvote"
        voted={myVote === true}
        votes={upvotes}
        size="small"
      />
      <Vote
        onClick={() => void handleDownvote()}
        voteType="downvote"
        voted={myVote === false}
        votes={downvotes}
        size="small"
      />
      {isOwn && (
        <button
          onClick={() => void handleDelete()}
          title="Delete"
          className="flex items-center gap-1.5 rounded-full border bg-zinc-100 px-2 py-0.5 font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200"
        >
          <Image src="/icons/delete.svg" alt="Delete" width={16} height={16} />
        </button>
      )}
    </div>
  )
}
