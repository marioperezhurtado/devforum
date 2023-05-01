import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useRouter } from "next/router"
import { categories } from "./categories"

import Link from "next/link"
import Button from "@/ui/Button"
import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import CategoryInfo from "@/components/Category/CategoryInfo/CategoryInfo"
import Filter from "@/components/Post/Filter/Filter"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"

import type { GetStaticPaths, GetStaticProps } from "next"
type Category = (typeof categories)[number]["name"]

const filters = ["trending", "latest", "most-upvoted", "controversial"]

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const name = ctx.params?.slug?.[0]
  if (!name) return { notFound: true }

  const filter = ctx.params?.slug?.[1] as string

  if (!categories.find((c) => c.name === name)) {
    return {
      notFound: true,
    }
  }
  if (filter && !filters.includes(filter)) {
    return {
      notFound: true,
    }
  }

  await ssg.post.category.getTrending.prefetch(name as Category)

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60 * 5, // 5 minutes
  }
}

export default function CategoryPage() {
  const router = useRouter()
  const { slug } = router.query
  const name = slug?.[0] as Category
  const filter = slug?.[1] ?? "trending"

  const category = (name[0]?.toUpperCase() ?? "") + name.slice(1)
  const description = categories.find((c) => c.name === name)
    ?.description as string

  const { data: trendingPosts, isLoading: trendingLoading } =
    api.post.category.getTrending.useQuery(name, {
      refetchOnWindowFocus: false,
    })

  const { data: latestPosts, isLoading: latestLoading } =
    api.post.category.getLatest.useQuery(name, {
      enabled: filter === "latest",
      refetchOnWindowFocus: false,
    })

  const { data: mostUpvotedPosts, isLoading: mostUpvotedLoading } =
    api.post.category.getMostUpvoted.useQuery(name, {
      enabled: filter === "most-upvoted",
      refetchOnWindowFocus: false,
    })

  const { data: controversialPosts, isLoading: controversialLoading } =
    api.post.category.getControversial.useQuery(name, {
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
      title={`${category} - DevForum`}
      description="Talk with other developers, exchange views, and share your thoughts about your favorite programming topics."
    >
      <CategoryInfo name={category} description={description} />
      <Filter baseLink={`/category/${name.toLowerCase()}`} filter={filter} />
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
        This category is ready for your post!
      </p>
      <p className="mx-auto max-w-md text-center">
        {`It seems that there are no post in this category, but that's not a big
        deal. Start the conversation by creating a post!`}
      </p>
      <Link href="/create/post">
        <Button className="mx-auto mt-5 block w-fit">Create a post</Button>
      </Link>
    </div>
  )
}
