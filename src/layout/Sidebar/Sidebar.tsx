import { useSession } from "next-auth/react"
import { api } from "@/utils/api"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"

import type { RouterOutputs } from "@/utils/api"

type Communities = RouterOutputs["community"]["getAllByMember"]

export default function Sidebar() {
  const { data: session } = useSession()

  const { data: trendingCommunities, isLoading: trendingLoading } =
    api.community.getTrending.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

  const { data: myCommunities, isLoading: myLoading } =
    api.community.getAllByMember.useQuery(session?.user.id ?? "", {
      enabled: !!session,
      refetchOnWindowFocus: false,
    })

  return (
    <aside className="flex w-64 flex-col gap-10 border-r border-zinc-200 bg-white px-6 py-5">
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
        {trendingCommunities?.length === 0 && (
          <p className="text-sm">
            {"Sorry, we couldn't find any communities. Try again later."}
          </p>
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
        {trendingCommunities?.length === 0 && (
          <p className="text-sm">
            {"Sorry, we couldn't find any communities. Try again later."}
          </p>
        )}
      </section>
      {session && (
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
          {myLoading && <CommunitiesSkeleton />}
          {myCommunities && <Communities communities={myCommunities} />}
          {myCommunities?.length === 0 && (
            <p className="text-sm">
              {"There's so much to discover! Join a community to get started."}
            </p>
          )}
        </section>
      )}
      <Button intent="secondary" className="mt-auto">
        Create a community
      </Button>
    </aside>
  )
}

function Communities({ communities }: { communities: Communities }) {
  return (
    <ul className="flex w-56 flex-col gap-2 pt-5">
      {communities.map((c) => (
        <li key={c.name}>
          <Link href={`/community/${c.name}`} className="py-1.5">
            {c.name}
          </Link>
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
      <span className="sr-only">Loading...</span>
    </div>
  )
}
