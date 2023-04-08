import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Categories from "@/components/Categories/Categories"
import PopularTopics from "@/components/Topic/PopularTopics/PopularTopics"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"

import type { GetStaticProps } from "next"

export const getStaticProps: GetStaticProps = async () => {
  await ssg.topic.getPopular.prefetch()

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 60 * 5, // 5 minutes
  }
}

export default function Home() {
  const { data: latestPosts, isLoading } = api.post.getLatest.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  )

  return (
    <ForumLayout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all developers to learn, share, and connect with your community. Wether you are a newbie or a seasoned dev, you can find a place to chat about your passion."
    >
      <Categories />
      <PopularTopics />
      {isLoading && <PostPreviewsSkeleton />}
      {latestPosts && <PostPreviews posts={latestPosts} />}
    </ForumLayout>
  )
}
