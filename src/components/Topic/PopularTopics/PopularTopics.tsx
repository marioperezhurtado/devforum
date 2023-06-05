import { useState, useRef } from "react"
import { api } from "@/utils/api"

import Link from "next/link"

export default function PopularTopics() {
  const [isScrolling, setIsScrolling] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  const { data: topics, isLoading } = api.topic.getPopular.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  const handleScroll = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!isScrolling) return
    if (!listRef.current) return

    const distance = e.movementX
    listRef.current.scrollLeft -= distance
  }

  if (isLoading) return <TopicsSkeleton />

  return (
    <ul
      ref={listRef}
      onMouseDown={() => setIsScrolling(true)}
      onMouseUp={() => setIsScrolling(false)}
      onMouseLeave={() => setIsScrolling(false)}
      onMouseMove={handleScroll}
      className="scrollbar-hide my-5 flex cursor-grab select-none gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10"
    >
      {topics?.map((t) => (
        <li key={t.name}>
          <Topic name={t.name} />
        </li>
      ))}
    </ul>
  )
}

function Topic({ name }: { name: string }) {
  return (
    <Link
      href={`/topic/${name}`}
      className="z-10 min-w-fit rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 shadow-md transition hover:bg-sky-500"
    >
      #{name}
    </Link>
  )
}

function TopicsSkeleton() {
  return (
    <div className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-20 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-14 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-20 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
      <div>
        <div className="h-6 w-16 min-w-fit rounded-full bg-sky-600" />
      </div>
    </div>
  )
}
