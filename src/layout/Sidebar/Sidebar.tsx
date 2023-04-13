import { useRef } from "react"
import { useSession } from "next-auth/react"
import { api } from "@/utils/api"
import { useSidebarStore } from "./store"
import useOnClickOutside from "@/hooks/useOnClickOutside"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"
import Communities, {
  CommunitiesSkeleton,
} from "@/components/Community/Communities/Communities"

import type { RouterOutputs } from "@/utils/api"

type Communities = RouterOutputs["community"]["getAllByMember"]

export default function Sidebar() {
  const ref = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const { isOpen, close } = useSidebarStore()

  const { data: trendingCommunities, isLoading: trendingLoading } =
    api.community.getTrendingPreview.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

  const { data: discoverCommunities, isLoading: discoverLoading } =
    api.community.getDiscoverPreview.useQuery(undefined, {
      refetchOnWindowFocus: false,
    })

  const { data: myCommunities, isLoading: myLoading } =
    api.community.getAllByMember.useQuery(session?.user.id ?? "", {
      enabled: !!session,
      refetchOnWindowFocus: false,
    })

  useOnClickOutside({ ref, handler: close })

  return (
    <aside
      ref={ref}
      className={`z-10 w-64 flex-col border-r border-zinc-200 bg-white px-6 py-5 ${
        isOpen ? "fixed top-0 flex h-full shadow-md" : "hidden lg:flex"
      }`}
    >
      <section className="flex flex-col-reverse gap-10 lg:flex-col">
        <div>
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
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Discover</h2>
            <Image
              src="/icons/discover.svg"
              alt="Discover"
              width={20}
              height={20}
            />
          </div>
          {discoverLoading && <CommunitiesSkeleton />}
          {discoverCommunities && (
            <Communities communities={discoverCommunities} />
          )}
          {discoverCommunities?.length === 0 && (
            <p className="text-sm">
              {"Sorry, we couldn't find any communities. Try again later."}
            </p>
          )}
        </div>
        {session && (
          <div>
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
                {
                  "There's so much to discover! Join a community to get started."
                }
              </p>
            )}
          </div>
        )}
      </section>
      <Link
        href={
          session ? "/create/community" : "/signIn?redirectTo=/create/community"
        }
        className="mt-auto"
      >
        <Button intent="secondary" className="w-full">
          Create a community
        </Button>
      </Link>
    </aside>
  )
}
