import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Link from "next/link"
import Avatar from "@/ui/Avatar"
import CommunityButton from "@/ui/CommunityButton"
import PostTopic from "@/components/Topic/PostTopic/PostTopic"
import Actions from "@/components/Post/Actions/Actions"

import type { RouterOutputs } from "@/utils/api"
type Post = RouterOutputs["post"]["community"]["getLatest"][0]

const MAX_PREVIEW_LENGTH = 200
dayjs.extend(relativeTime)

export default function PostPreviewItem({ post }: { post: Post }) {
  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
          <h2 className="text-lg font-semibold">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </h2>
          <CommunityButton community={post.community} />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/profile/${post.creator.email ?? ""}`}
            className="font-semibold"
          >
            {post.creator.name}
          </Link>
          <Avatar user={post.creator} size="small" />
        </div>
      </div>
      <p className="whitespace-pre-line break-words">
        {post.content.length <= MAX_PREVIEW_LENGTH && post.content}
        {post.content.length > MAX_PREVIEW_LENGTH &&
          post.content.slice(0, MAX_PREVIEW_LENGTH)}
        {post.content.length > MAX_PREVIEW_LENGTH && <span>...</span>}
      </p>
      {post.content.length > MAX_PREVIEW_LENGTH && (
        <Link
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
                <PostTopic topic={t} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex items-center justify-between text-sm">
          <Actions post={post} />
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
