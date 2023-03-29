import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/PostPreviews/PostPreviews"

import type { GetServerSideProps } from "next"

dayjs.extend(relativeTime)

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

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.getLatestByCommunityName.useQuery(name as string, {
      enabled: !!name,
    })

  return (
    <ForumLayout
      title={`${community?.name ?? ""} Community - DevForum.dev`}
      description={community?.description ?? ""}
    >
      <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
        <p className="mb-2 text-sm">Community</p>
        <div className="flex flex-wrap items-center gap-6">
          <h1 className="break-words text-xl font-semibold md:text-2xl">
            {community?.name}
          </h1>
          <Button>Join</Button>
        </div>
        <h2 className="mb-2 mt-3 md:mt-5 md:text-xl">
          {community?.description}
        </h2>
        <p className="text-right text-sm">
          Created on {dayjs(community?.createdAt).format("MM-DD-YYYY")}
        </p>
      </div>
      <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
        <li className="min-w-fit">
          <Link
            href={`/community/${community?.name ?? ""}/trending`}
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
        <li className="min-w-fit">
          <Link
            href={`/community/${community?.name ?? ""}/latest`}
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
        <li className="min-w-fit">
          <Link
            href={`/community/${community?.name ?? ""}/most-upvoted`}
            className="z-10 flex items-center gap-1 rounded-full bg-sky-600 px-2 py-1 text-sm font-semibold text-sky-50 transition hover:bg-sky-500"
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
            href={`/community/${community?.name ?? ""}/controversial`}
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
      {latestLoading && <PostPreviewsSkeleton />}
      {!!latestPosts?.length && <PostPreviews posts={latestPosts} />}
      {!latestPosts?.length && !latestLoading && (
        <div>
          <p className="mb-2 text-center text-xl font-semibold">
            No posts yet? No problem!
          </p>
          <p className="mx-auto max-w-md text-center">
            {`We're excited to have you here. Take the first step and leave your
            mark on this community.`}
          </p>
          <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
        </div>
      )}
    </ForumLayout>
  )
}
