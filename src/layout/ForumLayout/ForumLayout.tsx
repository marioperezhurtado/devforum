import Layout from "@/layout/Layout/Layout"
import Header from "@/layout/Header/Header"
import Sidebar from "@/layout/Sidebar/Sidebar"

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

export default function ForumLayout({ title, description, children }: Props) {
  return (
    <Layout title={title} description={description}>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-grow overflow-hidden">
          <Sidebar />
          <div className="w-full overflow-x-hidden overflow-y-scroll">
            <div className="mx-auto min-h-screen max-w-screen-md p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
