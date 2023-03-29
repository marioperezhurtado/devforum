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
  const name = ctx.params?.name
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
  const { name } = router.query

  const { data: topic } = api.topic.getByName.useQuery(name as string)

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.getLatestByTopic.useQuery(name as string, {
      enabled: !!name,
    })

  return (
    <ForumLayout
      title={`#${topic?.name ?? ""} - DevForum.dev`}
      description={`#${topic?.name ?? ""} 
      Topic at DevForum.dev, the place for all programmers to learn, share, and connect with your community.  `}
    >
      <div className="rounded-md border bg-white px-6 py-4 shadow-md">
        <p className="mb-2 text-sm">Topic</p>
        <div className="flex flex-wrap items-center gap-6">
          <h1 className="text-3xl font-semibold">#{topic?.name}</h1>
          <Button>Follow</Button>
        </div>
        <p className="text-right text-sm">
          Created on {topic?.createdAt.toLocaleDateString()}
        </p>
      </div>
      <ul className="scrollbar-hide my-10 flex gap-2 overflow-x-scroll rounded-md bg-zinc-700 p-1.5">
        <li>
          <Link
            href={`/topic/${topic?.name ?? ""}/trending`}
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
            href={`/topic/${topic?.name ?? ""}/latest`}
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
            href={`/topic/${topic?.name ?? ""}/most-upvoted`}
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
        <li>
          <Link
            href={`/topic/${topic?.name ?? ""}/controversial`}
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
            Ready to kick off this topic?
          </p>
          <p className="mx-auto max-w-md text-center">
            {`Don't be shy - if there's something related to ${
              topic?.name ?? ""
            } that you want to share, start now.`}
          </p>
          <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
        </div>
      )}
    </ForumLayout>
  )
}
