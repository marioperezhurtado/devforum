import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Image from "next/image"
import Link from "next/link"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostPreviews from "@/components/PostPreviews/PostPreviews"

import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const name = ctx.params?.name
  const community = await ssg.community.getByName.fetch(name as string)

  if (!community) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}

export default function CommunityPage() {
  const router = useRouter()
  const { name } = router.query

  const { data: community } = api.community.getByName.useQuery(name as string)

  const { data: latestPosts } = api.post.getLatestByCommunityName.useQuery(
    name as string,
    { enabled: !!name }
  )

  return (
    <ForumLayout
      title={`${community?.name ?? ""} Community - DevForum.dev`}
      description="Wait a moment"
    >
      <div className="rounded-md border bg-white px-6 py-4 shadow-md">
        <p className="mb-2 text-sm">Community</p>
        <div className="flex flex-wrap items-center gap-6">
          <h1 className="break-words text-3xl font-semibold">
            {community?.name}
          </h1>
          <button className="rounded-full border-2 border-sky-600 bg-sky-600 px-4 py-1 text-sm font-semibold text-sky-100 transition hover:border-sky-500 hover:bg-sky-500">
            Join
          </button>
        </div>
        <h2 className="mt-5 mb-2 text-xl">{community?.description}</h2>
        <p className="text-right text-sm">
          Created on {community?.createdAt.toLocaleDateString()}
        </p>
      </div>
      <ul className="scrollbar-hide my-10 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5">
        <li>
          <Link
            href="#"
            className="z-10 flex items-center gap-1 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
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
        <li>
          <Link
            href="#"
            className="z-10 flex items-center gap-1 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
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
        <li>
          <Link
            href="#"
            className="z-10 flex items-center gap-1 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
          >
            <Image
              src="/icons/upvote.svg"
              alt="Most Upvoted Posts"
              width={18}
              height={18}
            />
            Most upvoted
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="z-10 flex items-center gap-1 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
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
      {latestPosts && <PostPreviews posts={latestPosts} />}
    </ForumLayout>
  )
}
