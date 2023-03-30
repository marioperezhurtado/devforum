import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Image from "next/image"
import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/PostPreviews/PostPreviews"

import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const name = ctx.params?.slug?.[0]
  const topic = await ssg.topic.getByName.fetch(name as string)

  if (!topic) {
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

export default function TopicPage() {
  const router = useRouter()
  const { slug } = router.query
  const name = slug?.[0]
  const filter = slug?.[1] ?? "trending"

  const { data: topic } = api.topic.getByName.useQuery(name as string)

  const { data: trendingPosts, isFetching: trendingLoading } =
    api.post.topic.getTrending.useQuery(name as string, {
      enabled: filter === "trending",
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isFetching: latestLoading } =
    api.post.topic.getLatest.useQuery(name as string, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isFetching: mostUpvotedLoading } =
    api.post.topic.getMostUpvoted.useQuery(name as string, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isFetching: controversialLoading } =
    api.post.topic.getControversial.useQuery(name as string, {
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
      title={`#${topic?.name ?? ""} - DevForum.dev`}
      description={`#${topic?.name ?? ""} 
      Topic at DevForum.dev, the place for all programmers to learn, share, and connect with your community.  `}
    >
      <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
        <p className="mb-2 text-sm">Topic</p>
        <div className="mb-3 flex flex-wrap items-center gap-6">
          <h1 className="text-xl font-semibold md:text-2xl">#{topic?.name}</h1>
          <Button>Follow</Button>
        </div>
        <p className="text-right text-sm">
          Created on {topic?.createdAt.toLocaleDateString()}
        </p>
      </div>
      <ul className="scrollbar-hide my-5 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5 md:my-10">
        <li className="min-w-fit">
          <Link
            href={`/topic/${topic?.name ?? ""}/trending`}
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
            href={`/topic/${topic?.name ?? ""}/latest`}
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
            href={`/topic/${topic?.name ?? ""}/most-upvoted`}
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
            href={`/topic/${topic?.name ?? ""}/controversial`}
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
      {!posts?.length && !isLoading && (
        <NoPostsFound name={topic?.name ?? ""} />
      )}
    </ForumLayout>
  )
}

function NoPostsFound({ name }: { name: string }) {
  return (
    <div>
      <p className="mb-2 text-center text-xl font-semibold">
        Ready to kick off this topic?
      </p>
      <p className="mx-auto max-w-md text-center">
        {`Don't be shy - if there's something related to ${name} that you want to share, start now.`}
      </p>
      <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
    </div>
  )
}
