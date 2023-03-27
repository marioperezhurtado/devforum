import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Avatar from "@/ui/Avatar"
import Link from "next/link"
import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"

type Posts = RouterOutputs["post"]["getLatestByCommunityName"]

const MAX_PREVIEW_LENGTH = 200
dayjs.extend(relativeTime)

export default function PostPreviews({ posts }: { posts: Posts }) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-md border bg-white px-6 py-4 shadow-md"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex items-start gap-6 ">
              <h2 className="text-lg font-semibold">
                <Link href={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <Link
                href={`/community/${post.community.name}`}
                className="mt-0.5 min-w-fit rounded-full bg-green-500 px-2 py-0.5 text-sm font-bold text-green-50"
              >
                {post.community.name}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>{post.creator.name}</span>
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
              post.content.slice(0, MAX_PREVIEW_LENGTH) + "..."}
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
              <Link
                href={`/post/${post.id}`}
                className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 font-semibold text-zinc-600 transition hover:bg-zinc-200"
              >
                <Image
                  src="/icons/comment.svg"
                  alt="Comments"
                  width={16}
                  height={16}
                />
                {post._count.comments}
              </Link>
              <span className="ml-auto">{dayjs(post.createdAt).fromNow()}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

function PostPreviewSkeleton() {
  return (
    <div className="animate-pulse rounded-md border bg-white px-6 py-4 shadow-md">
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

export function PostPreviewsSkeleton() {
  return (
    <ul className="flex flex-col gap-4">
      <PostPreviewSkeleton />
      <PostPreviewSkeleton />
      <PostPreviewSkeleton />
    </ul>
  )
}
