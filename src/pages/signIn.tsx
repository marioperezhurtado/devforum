import { getServerAuthSession } from "@/server/auth"
import { signIn } from "next-auth/react"

import Layout from "@/layout/Layout/Layout"
import Image from "next/image"
import Link from "next/link"

import type { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx)

  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default function SignIn() {
  return (
    <Layout
      title="Sign In - DevForum.dev"
      description="Sign in to your DevForum.dev account and connect with other developers"
    >
      <div className="relative mx-auto my-20 max-w-sm rounded-xl border bg-white py-10 px-6 text-center shadow-md">
        <h1 className="mb-5 text-3xl font-semibold">Sign In</h1>
        <Link
          href="/"
          className="absolute top-4 left-4 rounded-md border shadow-md"
        >
          <Image
            src="/icons/back.svg"
            alt="Back to main page"
            width={32}
            height={32}
          />
        </Link>
        <p>
          Continue to your{" "}
          <span className="font-bold text-sky-600">DevForum.dev</span> account
          and connect with other developers.
        </p>
        <ul className="mt-10 flex flex-col gap-4">
          <li>
            <button
              onClick={() => void signIn("github")}
              className="mx-auto flex items-center gap-2 rounded-full bg-neutral-800 py-2 px-4 text-zinc-100 shadow-md transition hover:bg-neutral-700"
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
              className="mx-auto flex items-center gap-2 rounded-full bg-[#5766e3]  py-2 px-4 text-zinc-100 shadow-md transition hover:bg-[#6a76e0]"
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
      <p className="text-center">
        Not a member yet?{" "}
        <Link href="/create-account" className="font-bold text-sky-600">
          Create account
        </Link>
      </p>
    </Layout>
  )
}
