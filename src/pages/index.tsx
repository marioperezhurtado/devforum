import { api } from "@/utils/api"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Categories from "@/components/Categories/Categories"
import Topics from "@/components/Topics/Topics"
import PostPreviews, {
  PostPreviewsSkeleton,
} from "@/components/Post/PostPreviews/PostPreviews"

export default function Home() {
  const { data: featuredPosts, isLoading } = api.post.getFeatured.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  )

  return (
    <ForumLayout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all developers to learn, share, and connect with your community. Wether you are a newbie or a seasoned dev, you can find a place to chat about your passion."
    >
      <Categories />
      <Topics />
      {isLoading && <PostPreviewsSkeleton />}
      {featuredPosts && <PostPreviews posts={featuredPosts} />}
    </ForumLayout>
  )
}
