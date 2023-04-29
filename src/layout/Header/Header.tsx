import { useSession } from "next-auth/react"
import { useSidebarStore } from "@/layout/Sidebar/store"

import Image from "next/image"
import Link from "next/link"
import AccountDropdown from "./AccountDropdown"
import Search from "@/components/Search/Search"
import Button from "@/ui/Button"

export default function Header() {
  const { data: session } = useSession()
  const { open } = useSidebarStore()

  return (
    <header className="mx-auto flex w-full items-center justify-between border-b border-zinc-200 bg-white px-3 text-zinc-700 xs:px-4 sm:py-3 sm:px-6">
      <div className="flex items-center gap-6">
        <button onClick={open} className="lg:hidden" name="Open sidebar">
          <Image
            src="/icons/menu.svg"
            alt="Toggle Menu"
            width={30}
            height={30}
          />
        </button>
        <Link href="/">
          <h1 className="text-xl font-bold">
            <span className="text-sky-600">Dev</span>Forum
          </h1>
        </Link>
      </div>
      <Search />
      {!session && (
        <Link href="/signIn">
          <Button intent="primary">Sign In</Button>
        </Link>
      )}
      {session && (
        <div className="flex items-center gap-2">
          <Link
            href="/create/post"
            className="flex w-fit items-center justify-center rounded-full border bg-white px-3 py-1.5 transition-all hover:shadow-sm"
          >
            <Image
              src="/icons/create.svg"
              alt="Create Post"
              width={20}
              height={20}
            />
          </Link>
          <AccountDropdown />
        </div>
      )}
    </header>
  )
}
