import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"
type Topic = RouterOutputs["topic"]["getPopular"][0]

export default function PostTopic({ topic }: { topic: Topic }) {
  return (
    <Link href={`/topic/${topic.name}`} className="py-1.5 font-semibold">
      #{topic.name}
    </Link>
  )
}
