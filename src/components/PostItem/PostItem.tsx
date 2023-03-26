import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Avatar from "@/ui/Avatar"
import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"

type Post = RouterOutputs["post"]["getFeatured"][0]

dayjs.extend(relativeTime)

export default function PostItem({ post }: { post: Post }) {
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
      <div className="mt-10 flex justify-between text-xs">
        {post.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {post.topics.map((t) => (
              <li key={t.name}>
                <Link href={`/topic/${t.name}`} className="font-semibold">
                  #{t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <span className="ml-auto">{dayjs(post.createdAt).fromNow()}</span>
      </div>
    </div>
  )
}
