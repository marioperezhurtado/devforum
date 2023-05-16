import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"

import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import CommunityInfo from "@/components/Community/CommunityInfo/CommunityInfo"
import Filter from "@/components/Post/Filter/Filter"
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

  return (
    <ForumLayout
      title={`${name} Community - DevForum.dev`}
      description={community?.description ?? ""}
      ogImage={`https://devforum.dev/api/og/community?name=${name}&description=${
        community?.description ?? ""
      }&members=${community?._count?.members ?? 0}&posts=${
        community?._count?.posts ?? 0
      }`}
    >
      {community && <CommunityInfo community={community} />}
      <Filter baseLink={`/community/${name}`} filter={filter} />
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
