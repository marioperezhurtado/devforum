import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import usePrefetch from "@/hooks/usePrefetch"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import CommunityInfo from "@/components/Community/CommunityInfo/CommunityInfo"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"

import type { GetStaticPaths, GetStaticProps } from "next"

const filters = ["trending", "latest", "most-upvoted", "controversial"]

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const name = ctx.params?.slug?.[0]
  const filter = ctx.params?.slug?.[1] as string

  if (filter && !filters.includes(filter)) {
    return {
      notFound: true,
    }
  }

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
    revalidate: 60 * 5, // 5 minutes
  }
}

export default function CommunityPage() {
  const router = useRouter()
  const utils = api.useContext()
  const { slug } = router.query
  const name = slug?.[0] as string
  const filter = slug?.[1] ?? "trending"

  const { data: community } = api.community.getByName.useQuery(name, {
    refetchOnWindowFocus: false,
  })

  const { data: trendingPosts, isLoading: trendingLoading } =
    api.post.community.getTrending.useQuery(name, {
      enabled: filter === "trending",
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.community.getLatest.useQuery(name, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isLoading: mostUpvotedLoading } =
    api.post.community.getMostUpvoted.useQuery(name, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isLoading: controversialLoading } =
    api.post.community.getControversial.useQuery(name, {
      enabled: filter === "controversial",
      refetchOnWindowFocus: false,
    })

  const data = {
    trending: { posts: trendingPosts, isLoading: trendingLoading },
    latest: { posts: latestPosts, isLoading: latestLoading },
    "most-upvoted": { posts: mostUpvotedPosts, isLoading: mostUpvotedLoading },
    controversial: {
      posts: controversialPosts,
      isLoading: controversialLoading,
    },
  }

  const { posts, isLoading } = data[filter as keyof typeof data]

  const prefetchTrending = usePrefetch(
    () => void utils.post.community.getTrending.prefetch(name)
  )
  const prefetchLatest = usePrefetch(
    () => void utils.post.community.getLatest.prefetch(name)
  )
  const prefetchUpvoted = usePrefetch(
    () => void utils.post.community.getMostUpvoted.prefetch(name)
  )
  const prefetchControversial = usePrefetch(
    () => void utils.post.community.getControversial.prefetch(name)
  )

  return (
    <ForumLayout
      title={`${name} Community - DevForum.dev`}
      description={community?.description ?? ""}
    >
      {community && <CommunityInfo community={community} />}
      <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
        <li className="min-w-fit">
          <Link
            onMouseEnter={prefetchTrending}
            href={`/community/${name}/trending`}
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
            onMouseEnter={prefetchLatest}
            href={`/community/${name}/latest`}
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
            onMouseEnter={prefetchUpvoted}
            href={`/community/${name}/most-upvoted`}
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
            onMouseEnter={prefetchControversial}
            href={`/community/${name}/controversial`}
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
