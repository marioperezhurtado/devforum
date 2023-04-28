import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"
type Communities = RouterOutputs["community"]["getTrending"]

export default function Communities({
  communities,
}: {
  communities: Communities
}) {
  return (
    <ul className="flex w-56 flex-col gap-2 pt-5">
      {communities.map((c) => (
        <li key={c.name} className="w-fit pr-4">
          <Community community={c} />
        </li>
      ))}
    </ul>
  )
}

export function CommunitiesSkeleton() {
  return (
    <div className="flex w-56 animate-pulse flex-col gap-2 pt-5">
      <div className="my-[2px] h-5 w-40 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-48 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-32 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-36 rounded-full bg-zinc-100" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

function Community({ community }: { community: Communities[0] }) {
  return (
    <Link href={`/community/${community.name}`} className="py-1.5">
      {community.name}
    </Link>
  )
}
