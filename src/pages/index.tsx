import Layout from "@/layout/Layout/Layout"
import Header from "@/layout/Header/Header"
import Communities from "@/components/Communities/Communities"
import Categories from "@/components/Categories/Categories"
import Topics from "@/components/Topics/Topics"

export default function Home() {
  return (
    <Layout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all programmers to learn, share, and connect with your community. Wether you are a newbie or a seasoned developer, you can find a place to chat about your passion."
    >
      <Header />
      <div className="flex h-screen">
        <Communities />
        <div className="mx-auto w-full max-w-screen-md overflow-hidden p-10">
          <Categories />
          <Topics />
        </div>
      </div>
    </Layout>
  )
}
