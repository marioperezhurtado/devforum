import { useState } from "react"
import { signOut, useSession } from "next-auth/react"

import Image from "next/image"
import Link from "next/link"

export default function AccountDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen((o) => !o)}
          type="button"
          className="group flex w-full items-center justify-center rounded-full border bg-white px-3 py-1.5 transition-all hover:shadow-sm"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <Image
            src="/icons/profile.svg"
            alt="Your profile"
            width={22}
            height={22}
          />
          <svg
            className="-mr-1 h-5 w-5 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white text-sm shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <p className="px-4 py-2">
                Logged in as{" "}
                <span className="font-semibold">{session?.user.name}</span>
              </p>
            </div>

            <div role="none">
              <Link
                href={`/profile/${session?.user.email ?? ""}`}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 transition hover:bg-zinc-50"
                role="menuitem"
                id="menu-item-1"
              >
                <Image
                  src="/icons/profile.svg"
                  alt="Your profile"
                  width={16}
                  height={16}
                />
                Your profile
              </Link>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 transition hover:bg-zinc-50"
                role="menuitem"
                id="menu-item-2"
              >
                <Image
                  src="/icons/settings.svg"
                  alt="Account settings"
                  width={16}
                  height={16}
                />
                Account settings
              </a>
            </div>
            <div role="none">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-3 text-gray-700 transition hover:bg-zinc-50"
                role="menuitem"
                id="menu-item-3"
              >
                <Image
                  src="/icons/support.svg"
                  alt="Support"
                  width={16}
                  height={16}
                />
                Support
              </a>
              <a
                href="#"
                className="transiton flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-zinc-50"
                role="menuitem"
                id="menu-item-4"
              >
                <Image
                  src="/icons/terms-conditions.svg"
                  alt="Terms and conditions"
                  width={16}
                  height={16}
                />
                Terms and conditions
              </a>
            </div>

            <div role="none">
              <button
                onClick={() => void signOut()}
                className="flex w-full items-center gap-2 px-4 py-3 text-left font-bold text-gray-700 transition hover:bg-zinc-50"
                role="menuitem"
                id="menu-item-5"
              >
                <Image
                  src="/icons/signout.svg"
                  alt="Sign out"
                  width={16}
                  height={16}
                />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
