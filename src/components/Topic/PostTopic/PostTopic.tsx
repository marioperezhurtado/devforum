import { api } from "@/utils/api"
import usePrefetch from "@/hooks/usePrefetch"

import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"
type Topic = RouterOutputs["topic"]["getPopular"][0]

export default function PostTopic({ topic }: { topic: Topic }) {
  const utils = api.useContext()

  const prefetchPosts = usePrefetch(
    () => void utils.post.topic.getTrending.prefetch(topic.name)
  )

  return (
    <Link
      onMouseEnter={prefetchPosts}
      href={`/topic/${topic.name}`}
      className="py-1.5 font-semibold"
    >
      #{topic.name}
    </Link>
  )
}
