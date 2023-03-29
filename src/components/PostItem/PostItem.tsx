import { api } from "@/utils/api"
import useVote from "@/hooks/useVote"
import { useCommentStore } from "@/pages/post/store"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Link from "next/link"
import Image from "next/image"
import Avatar from "@/ui/Avatar"
import Vote from "@/ui/Vote"

import type { RouterOutputs } from "@/utils/api"

type Post = RouterOutputs["post"]["getFeatured"][0]

dayjs.extend(relativeTime)

export default function PostItem({ post }: { post: Post }) {
  const { open } = useCommentStore()

  const { mutate: handleVote } = api.postReaction.addOrUpdate.useMutation()
  const { mutate: handleRemoveVote } = api.postReaction.delete.useMutation()

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

  return (
    <div className="mb-10 rounded-md border bg-white px-6 py-4 shadow-md">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <span>{post.creator.name}</span>
          <Avatar
            name={post.creator.name ?? ""}
            imgUrl={post.creator.image}
            size="small"
          />
        </div>
      </div>
      <Link
        href={`/community/${post.community.name}`}
        className="mt-0.5 min-w-fit rounded-full bg-green-500 px-2 py-0.5 text-sm font-bold text-green-50"
      >
        {post.community.name}
      </Link>
      <p className="mt-5">{post.content}</p>
      <div className="mt-10">
        {post.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-sm">
            {post.topics.map((t) => (
              <li key={t.name}>
                <Link
                  href={`/topic/${t.name}`}
                  className="py-1.5 font-semibold"
                >
                  #{t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={open}
              className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-200"
            >
              <Image
                src="/icons/comment.svg"
                alt="Comments"
                width={16}
                height={16}
              />
              {post._count?.comments > 0 && post._count?.comments}
            </button>
            <Vote
              onClick={() => void handleUpvote()}
              voteType="upvote"
              voted={myVote === true}
              votes={upvotes}
              size="medium"
            />
            <Vote
              onClick={() => void handleDownvote()}
              voteType="downvote"
              voted={myVote === false}
              votes={downvotes}
              size="medium"
            />
          </div>
          <span className="ml-auto">{dayjs(post.createdAt).fromNow()}</span>
        </div>
      </div>
    </div>
  )
}
