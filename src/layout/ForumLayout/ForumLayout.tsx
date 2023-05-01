import { Work_Sans } from "next/font/google"

import Head from "next/head"
import Header from "@/layout/Header/Header"
import Sidebar from "@/layout/Sidebar/Sidebar"

const fontBody = Work_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

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
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta
          property="og:image"
          content={ogImage ?? "https://devforum.dev/api/og/default"}
        />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:type" content="website" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <main className={`${fontBody.className} min-h-screen text-zinc-700`}>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="relative flex flex-grow overflow-hidden">
            <Sidebar />
            <div className="w-full overflow-x-hidden overflow-y-scroll">
              <div className="mx-auto min-h-screen max-w-screen-md p-3 xs:p-5 sm:p-10">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
