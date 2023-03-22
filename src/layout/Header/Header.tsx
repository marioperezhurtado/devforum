import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"

import Image from "next/image"
import AccountDropdown from "./AccountDropdown"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="mx-auto flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-10 py-3 text-zinc-700">
      <h1 className="text-xl font-bold">
        <span className="text-sky-600">Dev</span>Forum
      </h1>
      <form name="searchForm" className="relative">
        <label htmlFor="search" className="sr-only">
          Search topics, posts, and users
        </label>
        <input
          name="search"
          id="search"
          type="text"
          placeholder="Start exploring..."
          className="w-96 rounded-full border bg-white px-4 py-1.5 focus:outline-sky-600"
        />
        <button className="absolute right-0 top-1/2 h-full -translate-y-1/2 rounded-r-full bg-sky-600 pl-2 pr-3">
          <Image src="/icons/search.svg" alt="Search" width={20} height={20} />
        </button>
      </form>
      {!session && (
        <div className="flex gap-4">
          <button className="rounded-full border-2 border-sky-600 px-4 py-1.5 text-sm font-semibold text-sky-600">
            Create account
          </button>
          <button
            onClick={() => void signIn("discord")}
            className="rounded-full border-2 border-sky-600 bg-sky-600 px-4 py-1.5 text-sm font-semibold text-sky-100"
          >
            Sign In
          </button>
        </div>
      )}
      {session && <AccountDropdown />}
    </header>
  )
}
