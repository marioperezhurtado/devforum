import { useSession } from "next-auth/react"

import Image from "next/image"
import Link from "next/link"
import AccountDropdown from "./AccountDropdown"
import Button from "@/ui/Button"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="mx-auto flex w-full items-center justify-between border-b border-zinc-200 bg-white px-10 py-3 text-zinc-700">
      <Link href="/">
        <h1 className="text-xl font-bold">
          <span className="text-sky-600">Dev</span>Forum
        </h1>
      </Link>
      <form name="searchForm" className="relative">
        <label htmlFor="search" className="sr-only">
          Search topics, posts, users and more
        </label>
        <input
          name="search"
          id="search"
          type="text"
          placeholder="Start exploring..."
          className="w-96 rounded-full border bg-zinc-50 px-4 py-1.5 focus:outline-sky-600"
        />
        <button className="absolute right-0 top-1/2 h-full -translate-y-1/2 rounded-r-full bg-sky-600 pl-2 pr-3 transition hover:bg-sky-500">
          <Image src="/icons/search.svg" alt="Search" width={20} height={20} />
        </button>
      </form>
      {!session && (
        <div className="flex items-center gap-4">
          <Button intent="secondary">Create account</Button>
          <Link href="/signIn">
            <Button intent="primary">Sign In</Button>
          </Link>
        </div>
      )}
      {session && <AccountDropdown />}
    </header>
  )
}
