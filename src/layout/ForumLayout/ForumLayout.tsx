import Layout from "@/layout/Layout/Layout"

import Header from "@/layout/Header/Header"
import MobileSearch from "@/components/Search/MobileSearch"
import Sidebar from "@/layout/Sidebar/Sidebar"

type Props = {
  title: string
  description: string
  ogImage?: string
  children: React.ReactNode
}

export default function ForumLayout({
  title,
  description,
  ogImage,
  children,
}: Props) {
  return (
    <Layout title={title} description={description} ogImage={ogImage}>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="relative flex flex-grow overflow-hidden">
          <Sidebar />
          <div className="w-full overflow-x-hidden overflow-y-scroll">
            <MobileSearch />
            <div className="mx-auto min-h-screen max-w-screen-md p-3 xs:p-5 sm:p-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
