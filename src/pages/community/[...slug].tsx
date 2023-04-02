import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import CommunityInfo from "@/components/Community/CommunityInfo/CommunityInfo"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"

import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const name = ctx.params?.slug?.[0]
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
  const { slug } = router.query
  const name = slug?.[0]
  const filter = slug?.[1] ?? "trending"

  const { data: community } = api.community.getByName.useQuery(name as string, {
    refetchOnWindowFocus: false,
  })

  const { data: trendingPosts, isFetching: trendingLoading } =
    api.post.community.getTrending.useQuery(name as string, {
      enabled: filter === "trending",
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isFetching: latestLoading } =
    api.post.community.getLatest.useQuery(name as string, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isFetching: mostUpvotedLoading } =
    api.post.community.getMostUpvoted.useQuery(name as string, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isFetching: controversialLoading } =
    api.post.community.getControversial.useQuery(name as string, {
      enabled: filter === "controversial",
      refetchOnWindowFocus: false,
    })

  const isLoading =
    trendingLoading ||
    latestLoading ||
    mostUpvotedLoading ||
    controversialLoading

  const posts =
    filter === "trending"
      ? trendingPosts
      : filter === "latest"
      ? latestPosts
      : filter === "most-upvoted"
      ? mostUpvotedPosts
      : controversialPosts

  return (
    <ForumLayout
      title={`${community?.name ?? ""} Community - DevForum.dev`}
      description={community?.description ?? ""}
    >
      {community && <CommunityInfo community={community} />}
      <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
        <li className="min-w-fit">
          <Link
            href={`/community/${community?.name ?? ""}/trending`}
            className={`z-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-sky-50 transition 
            ${
              filter === "trending"
                ? "bg-purple-500"
                : "bg-sky-600 hover:bg-sky-500"
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
            href={`/community/${community?.name ?? ""}/latest`}
            className={`z-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-sky-50 transition 
             ${
               filter === "latest"
                 ? "bg-purple-500"
                 : "bg-sky-600 hover:bg-sky-500"
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
            href={`/community/${community?.name ?? ""}/most-upvoted`}
            className={`z-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-sky-50 transition 
            ${
              filter === "most-upvoted"
                ? "bg-purple-500"
                : "bg-sky-600 hover:bg-sky-500"
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
            href={`/community/${community?.name ?? ""}/controversial`}
            className={`z-10 flex items-center gap-1 rounded-full px-2 py-1 text-sm font-semibold text-sky-50 transition 
            ${
              filter === "controversial"
                ? "bg-purple-500"
                : "bg-sky-600 hover:bg-sky-500"
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
      {isLoading && <PostPreviewsSkeleton />}
      {posts && posts.length > 0 && !isLoading && (
        <PostPreviews posts={posts} />
      )}
      {!posts?.length && !isLoading && <NoPostsFound />}
    </ForumLayout>
  )
}

function NoPostsFound() {
  return (
    <div>
      <p className="mb-2 text-center text-xl font-semibold">
        No posts yet? No problem!
      </p>
      <p className="mx-auto max-w-md text-center">
        {`We're excited to have you here. Take the first step and leave your
            mark on this community.`}
      </p>
      <Link href="/create/post">
        <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
      </Link>
    </div>
  )
}
