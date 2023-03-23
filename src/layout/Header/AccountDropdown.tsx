import { useState, useRef } from "react"
import { signOut, useSession } from "next-auth/react"
import useOnClickOutside from "@/hooks/useOnClickOutside"

import Image from "next/image"

export default function AccountDropdown() {
  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  useOnClickOutside({
    ref,
    handler: () => setIsOpen(false),
  })

  return (
    <>
      <div ref={ref} className="relative inline-block text-left">
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
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white text-sm shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1 " role="none">
              <p className="px-4 py-2">
                Logged in as{" "}
                <span className="font-semibold">{session?.user.name}</span>
              </p>
            </div>

            <div className="py-1" role="none">
              <a
                href="#"
                className="block px-4 py-2 text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-2"
              >
                Account settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-4"
              >
                Support
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-4"
              >
                Terms and conditions
              </a>
            </div>

            <div className="py-1" role="none">
              <button
                onClick={() => void signOut()}
                className="block w-full px-4 py-2 text-left font-bold text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-3"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}