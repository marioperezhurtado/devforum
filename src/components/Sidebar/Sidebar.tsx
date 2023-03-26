import { useSession } from "next-auth/react"
import { api } from "@/utils/api"

import Image from "next/image"
import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"

type Communities = RouterOutputs["community"]["getAllByMember"]

export default function Sidebar() {
  const { data: session } = useSession()

  const { data: myCommunities } = api.community.getAllByMember.useQuery(
    session?.user.id ?? "",
    {
      enabled: !!session,
    }
  )

  const { data: trendingCommunities, isLoading: trendingLoading } =
    api.community.getTrending.useQuery()

  return (
    <aside className="flex w-64 flex-col gap-10 border-r border-zinc-200 bg-white px-4 py-5">
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Trending</h2>
          <Image
            src="/icons/trending.svg"
            alt="Trending"
            width={20}
            height={20}
          />
        </div>
        {trendingLoading && <CommunitiesSkeleton />}
        {trendingCommunities && (
          <Communities communities={trendingCommunities} />
        )}
      </section>
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Discover</h2>
          <Image
            src="/icons/discover.svg"
            alt="Discover"
            width={20}
            height={20}
          />
        </div>
        {trendingLoading && <CommunitiesSkeleton />}
        {trendingCommunities && (
          <Communities communities={trendingCommunities} />
        )}
      </section>
      {session && myCommunities && (
        <section>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Your communities</h2>
            <Image
              src="/icons/community.svg"
              alt="Your communities"
              width={20}
              height={20}
            />
          </div>
          {myCommunities && <Communities communities={myCommunities} />}
        </section>
      )}
    </aside>
  )
}

function Communities({ communities }: { communities: Communities }) {
  return (
    <ul className="flex w-56 flex-col gap-2 pt-5">
      {communities.map((c) => (
        <li key={c.name}>
          <Link href={`/community/${c.name}`}>{c.name}</Link>
        </li>
      ))}
    </ul>
  )
}

function CommunitiesSkeleton() {
  return (
    <div className="flex w-56 animate-pulse flex-col gap-2 pt-5">
      <div className="my-[2px] h-5 w-40 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-48 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-32 rounded-full bg-zinc-100" />
      <div className="my-[2px] h-5 w-36 rounded-full bg-zinc-100" />
    </div>
  )
}
