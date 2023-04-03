import { api } from "@/utils/api"
import useVote from "@/hooks/useVote"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import usePrefetch from "@/hooks/usePrefetch"

import Link from "next/link"
import Image from "next/image"
import Avatar from "@/ui/Avatar"
import Topic from "@/components/Topic/PostTopic/PostTopic"
import Vote from "@/ui/Vote"

import type { RouterOutputs } from "@/utils/api"

type Post = RouterOutputs["post"]["community"]["getLatest"][0]

const MAX_PREVIEW_LENGTH = 200
dayjs.extend(relativeTime)

export default function PostPreviewItem({ post }: { post: Post }) {
  const utils = api.useContext()

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

  const { handlePrefetch: prefetchComments } = usePrefetch(
    () => void utils.comment.getByPostId.prefetch(post.id)
  )

  return (
    <div className="rounded-md border bg-white py-2 px-3 shadow-md md:px-6 md:py-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
          <h2 className="text-lg font-semibold">
            <Link
              onMouseEnter={() => void prefetchComments()}
              href={`/post/${post.id}`}
            >
              {post.title}
            </Link>
          </h2>
          <Link
            href={`/community/${post.community.name}`}
            className="mt-0.5 min-w-fit rounded-full bg-green-500 px-2 py-0.5 text-sm font-bold text-green-50"
          >
            {post.community.name}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{post.creator.name}</span>
          <Avatar
            name={post.creator.name ?? ""}
            imgUrl={post.creator.image}
            size="small"
          />
        </div>
      </div>
      <p>
        {post.content.length <= MAX_PREVIEW_LENGTH && post.content}
        {post.content.length > MAX_PREVIEW_LENGTH &&
          post.content.slice(0, MAX_PREVIEW_LENGTH)}
        {post.content.length > MAX_PREVIEW_LENGTH && <span>...</span>}
      </p>
      {post.content.length > MAX_PREVIEW_LENGTH && (
        <Link
          onMouseEnter={() => void prefetchComments()}
          href={`/post/${post.id}`}
          className="mt-2 block w-fit py-1.5 text-sm text-sky-600 underline"
        >
          Read more...
        </Link>
      )}
      <div className="mt-5">
        {post.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2 text-sm">
            {post.topics.map((t) => (
              <li key={t.name}>
                <Topic topic={t} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex items-center justify-between text-sm">
          <div className="flex gap-2">
            <Link
              onMouseEnter={() => void prefetchComments()}
              href={`/post/${post.id}`}
              className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 font-semibold text-zinc-600 transition hover:bg-zinc-200"
            >
              <Image
                src="/icons/comment.svg"
                alt="Comments"
                width={16}
                height={16}
              />
              {post._count?.comments > 0 && post._count?.comments}
            </Link>
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

export function PostPreviewSkeleton() {
  return (
    <div className="animate-pulse rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-start gap-6 ">
          <div className="h-5 w-64 rounded-full bg-zinc-100" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="h-5 w-36 rounded-full bg-zinc-100" />
          <span className="aspect-square h-6 w-6 min-w-fit rounded-full bg-zinc-100 object-cover" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-4 w-full rounded-full bg-zinc-100" />
        <div className="h-4 w-full rounded-full bg-zinc-100" />
        <div className="h-4 w-3/4 rounded-full bg-zinc-100" />
      </div>
    </div>
  )
}
