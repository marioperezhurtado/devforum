import { useSession } from "next-auth/react"

import Image from "next/image"

export default function Communities() {
  const { data: session } = useSession()

  return (
    <aside className="flex w-96 flex-col gap-10 border-r border-zinc-200 bg-white px-4 py-5">
      {session && (
        <section>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Your communities</h2>
            <Image
              src="/icons/community.svg"
              alt="Your communities"
              width={22}
              height={22}
            />
          </div>
          <ul className="flex w-56 flex-col gap-2 pt-5">
            <li>
              <p>React Developers</p>
            </li>
            <li>
              <p>T3 Stack</p>
            </li>
            <li>
              <p>SvelteKit</p>
            </li>
            <li>
              <p>tRPC</p>
            </li>
            <li>
              <p>Spain Devs</p>
            </li>
          </ul>
        </section>
      )}
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Top communities</h2>
          <Image
            src="/icons/top.svg"
            alt="Top communities"
            width={22}
            height={22}
          />
        </div>
        <ul className="flex w-56 flex-col gap-2 pt-5">
          <li>
            <p>React Developers</p>
          </li>
          <li>
            <p>T3 Stack</p>
          </li>
          <li>
            <p>SvelteKit</p>
          </li>
          <li>
            <p>tRPC</p>
          </li>
          <li>
            <p>Spain Devs</p>
          </li>
        </ul>
      </section>
      <section>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Discover</h2>
          <Image
            src="/icons/discover.svg"
            alt="Discover"
            width={22}
            height={22}
          />
        </div>
        <ul className="flex w-56 flex-col gap-2 pt-5">
          <li>
            <p>Mobile Devs</p>
          </li>
          <li>
            <p>Web3</p>
          </li>
          <li>
            <p>Game Devs</p>
          </li>
          <li>
            <p>Rustaceans</p>
          </li>
        </ul>
      </section>
    </aside>
  )
}
