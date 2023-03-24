import { api } from "@/utils/api"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Categories from "@/components/Categories/Categories"
import Topics from "@/components/Topics/Topics"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/PostPreviews/PostPreviews"

export default function Home() {
  const { data: featuredPosts, isLoading } = api.post.getFeatured.useQuery()

  return (
    <ForumLayout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all programmers to learn, share, and connect with your community. Wether you are a newbie or a seasoned developer, you can find a place to chat about your passion."
    >
      <Categories />
      <Topics />
      {isLoading && <PostPreviewsSkeleton />}
      {featuredPosts && <PostPreviews posts={featuredPosts} />}
    </ForumLayout>
  )
}
