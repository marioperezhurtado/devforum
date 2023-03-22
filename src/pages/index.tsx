import Layout from "@/layout/Layout/Layout"
import Header from "@/layout/Header/Header"
import Communities from "@/components/Communities/Communities"

export default function Home() {
  return (
    <Layout
      title="DevForum.dev - Let's build together"
      description="DevForum is the place for all programmers to learn, share, and connect with your community. Wether you are a newbie or a seasoned developer, you can find a place to chat about your passion."
    >
      <Header />
      <div className="flex h-screen">
        <Communities />
        <div className="h-20 w-full bg-sky-100" />
      </div>
    </Layout>
  )
}
