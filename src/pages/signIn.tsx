import { useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/router"

import Layout from "@/layout/Layout/Layout"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

export default function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()
  const redirectTo = router.query.redirectTo as string

  useEffect(() => {
    if (!session) return
    void router.push(redirectTo ?? "/")
  }, [session, redirectTo, router])

  return (
    <Layout
      title="Sign In - DevForum.dev"
      description="Sign in to your DevForum.dev account and connect with other developers"
    >
      <Head>
        <meta
          property="og:image"
          content="https://devforum.dev/api/og/default"
        />
      </Head>
      <section className="mx-auto mb-10 mt-5 w-fit p-2 sm:mt-10 md:mt-20">
        <div className="relative max-w-sm rounded-xl border bg-white px-6 py-5 text-center shadow-md md:py-10">
          <h1 className="mb-5 text-3xl font-semibold">Sign In</h1>
          <button
            onClick={() => void router.push(redirectTo || "/")}
            className="absolute left-4 top-4 rounded-md border border-white transition hover:border-zinc-200 hover:bg-zinc-50"
          >
            <Image
              src="/icons/back.svg"
              alt="Back to main page"
              width={32}
              height={32}
            />
          </button>
          <p>
            Continue to your{" "}
            <span className="font-bold text-sky-600">DevForum.dev</span> account
            and connect with other developers.
          </p>
          <ul className="mt-10 flex flex-col gap-4">
            <li>
              <button
                onClick={() => void signIn("github")}
                className="mx-auto flex w-full items-center justify-center gap-2 rounded-full bg-neutral-800 px-4 py-2 text-zinc-100 shadow-md transition hover:bg-neutral-700"
              >
                <Image
                  src="/icons/github.svg"
                  alt="Sign in with Github"
                  width={30}
                  height={30}
                />{" "}
                Sign in with GitHub
              </button>
            </li>
            <li>
              <button
                onClick={() => void signIn("github")}
                className="mx-auto flex w-full items-center justify-center gap-2 rounded-full bg-[#5766e3] px-4 py-2 text-zinc-100 shadow-md transition hover:bg-[#6a76e0]"
              >
                <Image
                  src="/icons/discord.svg"
                  alt="Sign in with Discord"
                  width={30}
                  height={30}
                  className="p-0.5"
                />{" "}
                Sign in with Discord
              </button>
            </li>
          </ul>
        </div>
      </section>
      <p className="text-center">
        Not a member yet?{" "}
        <Link href="/create-account" className="font-bold text-sky-600">
          Create account
        </Link>
      </p>
    </Layout>
  )
}
