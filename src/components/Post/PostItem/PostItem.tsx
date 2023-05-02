import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Actions from "@/components/Post/Actions/Actions"

import Link from "next/link"
import Avatar from "@/ui/Avatar"
import CommunityButton from "@/ui/CommunityButton"
import PostContent from "../PostContent/PostContent"
import PostTopic from "@/components/Topic/PostTopic/PostTopic"
import CodeSnippets from "@/components/CodeSnippet/CodeSnippets/CodeSnippets"
import Links from "@/components/Post/Links/Links"

import type { RouterOutputs } from "@/utils/api"
type Post = NonNullable<RouterOutputs["post"]["getById"]>

dayjs.extend(relativeTime)

export default function PostItem({ post }: { post: Post }) {
  return (
    <div className="mb-5 rounded-md border bg-white px-3 py-2 shadow-md md:mb-10 md:px-6 md:py-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-lg font-semibold md:text-2xl">{post.title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/profile/${post.creator.email ?? ""}`}
            className="font-semibold"
          >
            {post.creator.name}
          </Link>
          <Avatar user={post.creator} size="medium" />
        </div>
      </div>
      <CommunityButton community={post.community} />
      <PostContent text={post.content} />
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
      {post.codeSnippets.length > 0 && (
        <CodeSnippets snippets={post.codeSnippets} />
      )}
      <Links post={post} />
    </div>
  )
}
