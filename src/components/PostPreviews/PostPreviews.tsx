import PostPreviewItem, {
  PostPreviewSkeleton,
} from "../PostPreviewItem/PostPreviewItem"

import type { RouterOutputs } from "@/utils/api"

type Posts = RouterOutputs["post"]["getLatestByCommunityName"]

export default function PostPreviews({ posts }: { posts: Posts }) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((p) => (
        <li key={p.id}>
          <PostPreviewItem post={p} />
        </li>
      ))}
    </ul>
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
