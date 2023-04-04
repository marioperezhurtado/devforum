import usePrefetch from "@/hooks/usePrefetch"

import Link from "next/link"
import Image from "next/image"

type Props = {
  baseLink: string
  filter: string
  prefetchTrending: () => void
  prefetchLatest: () => void
  prefetchUpvoted: () => void
  prefetchControversial: () => void
}

export default function Filter({
  baseLink,
  filter,
  prefetchTrending,
  prefetchLatest,
  prefetchUpvoted,
  prefetchControversial,
}: Props) {
  const handlePrefetchTrending = usePrefetch(prefetchTrending)
  const handlePrefetchLatest = usePrefetch(prefetchLatest)
  const handlePrefetchUpvoted = usePrefetch(prefetchUpvoted)
  const handlePrefetchControversial = usePrefetch(prefetchControversial)

  return (
    <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 text-sm font-semibold md:my-10">
      <li className="min-w-fit">
        <Link
          onMouseEnter={handlePrefetchTrending}
          href={`${baseLink}/trending`}
          className={`z-10 flex items-center gap-1 rounded-full px-2 py-1  transition
              ${
                filter === "trending"
                  ? "bg-purple-500 text-purple-50"
                  : "bg-sky-600 text-sky-50  hover:bg-sky-500 "
              }`}
        >
          <Image
            src="/icons/trending-light.svg"
            alt="Trending Posts"
            width={16}
            height={16}
          />
          Trending
        </Link>
      </li>
      <li className="min-w-fit">
        <Link
          onMouseEnter={handlePrefetchLatest}
          href={`${baseLink}/latest`}
          className={`z-10 flex items-center gap-1 rounded-full px-2 py-1  transition
              ${
                filter === "latest"
                  ? "bg-purple-500 text-purple-50"
                  : "bg-sky-600 text-sky-50  hover:bg-sky-500 "
              }`}
        >
          <Image
            src="/icons/latest.svg"
            alt="Latest Posts"
            width={16}
            height={16}
          />
          Latest
        </Link>
      </li>
      <li className="min-w-fit">
        <Link
          onMouseEnter={handlePrefetchUpvoted}
          href={`${baseLink}/most-upvoted`}
          className={`z-10 flex items-center gap-1 rounded-full px-2 py-1  transition
              ${
                filter === "most-upvoted"
                  ? "bg-purple-500 text-purple-50"
                  : "bg-sky-600 text-sky-50  hover:bg-sky-500 "
              }`}
        >
          <Image
            src="/icons/upvote-light.svg"
            alt="Most Upvoted Posts"
            width={18}
            height={18}
          />
          Most upvoted
        </Link>
      </li>
      <li className="min-w-fit">
        <Link
          onMouseEnter={handlePrefetchControversial}
          href={`${baseLink}/controversial`}
          className={`z-10 flex items-center gap-1 rounded-full px-2 py-1  transition
              ${
                filter === "controversial"
                  ? "bg-purple-500 text-purple-50"
                  : "bg-sky-600 text-sky-50  hover:bg-sky-500 "
              }`}
        >
          <Image
            src="/icons/controversial.svg"
            alt="Most Controversial Posts"
            width={16}
            height={16}
          />
          Controversial
        </Link>
      </li>
    </ul>
  )
}
