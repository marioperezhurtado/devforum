import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Head from "next/head"
import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Filter from "@/components/Filter/Filter"
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

  const topic = await ssg.topic.getByName.fetch(name as string)

  if (!topic) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      revalidate: 60 * 5, // 5 minutes
    },
  }
}

export default function TopicPage() {
  const router = useRouter()
  const utils = api.useContext()
  const { slug } = router.query
  const name = slug?.[0] as string
  const filter = slug?.[1] ?? "trending"

  const { data: topic } = api.topic.getByName.useQuery(name, {
    refetchOnWindowFocus: false,
  })

  const { data: trendingPosts, isLoading: trendingLoading } =
    api.post.topic.getTrending.useQuery(name, {
      enabled: filter === "trending",
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.topic.getLatest.useQuery(name, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isLoading: mostUpvotedLoading } =
    api.post.topic.getMostUpvoted.useQuery(name, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isLoading: controversialLoading } =
    api.post.topic.getControversial.useQuery(name, {
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

  return (
    <ForumLayout
      title={`#${topic?.name ?? ""} - DevForum.dev`}
      description={`#${topic?.name ?? ""} 
      Topic at DevForum.dev, the place for all programmers to learn, share, and connect with your community.  `}
    >
      <Head>
        <meta
          property="og:image"
          content={`https://devforum.dev/api/og/topic?topic=${
            topic?.name ?? ""
          }`}
        />
      </Head>
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
      <Filter
        baseLink={`/topic/${name}`}
        filter={filter}
        prefetchTrending={() =>
          void utils.post.topic.getTrending.prefetch(name)
        }
        prefetchLatest={() => void utils.post.topic.getLatest.prefetch(name)}
        prefetchUpvoted={() =>
          void utils.post.topic.getMostUpvoted.prefetch(name)
        }
        prefetchControversial={() =>
          void utils.post.topic.getControversial.prefetch(name)
        }
      />
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
      <Link href="/create/post">
        <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
      </Link>
    </div>
  )
}
