import { api } from "@/utils/api"

import Layout from "@/layout/Layout/Layout"
import Header from "@/layout/Header/Header"
import Sidebar from "@/components/Sidebar/Sidebar"
import Categories from "@/components/Categories/Categories"
import Topics from "@/components/Topics/Topics"
import PostPreviews from "@/components/PostPreviews/PostPreviews"

export default function Home() {
  const { data: featuredPosts } = api.post.getFeatured.useQuery()

  return (
    <Layout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all programmers to learn, share, and connect with your community. Wether you are a newbie or a seasoned developer, you can find a place to chat about your passion."
    >
      <Header />
      <div className="flex h-screen">
        <Sidebar />
        <div className="mx-auto w-full max-w-screen-md overflow-hidden p-10">
          <Categories />
          <Topics />
          {featuredPosts && <PostPreviews posts={featuredPosts} />}
        </div>
      </div>
    </Layout>
  )
}
