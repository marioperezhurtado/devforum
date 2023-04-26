import { Work_Sans } from "next/font/google"

import Head from "next/head"

const fontBody = Work_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
})

type Props = {
  title: string
  description: string
  children: React.ReactNode
}

export default function Layout({ title, description, children }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <main className={`${fontBody.className} min-h-screen text-zinc-700`}>
        {children}
      </main>
    </>
  )
}
