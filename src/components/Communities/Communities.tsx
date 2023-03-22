import Image from "next/image"

export default function Communities() {
  return (
    <nav className="flex min-w-fit flex-col border-r border-zinc-200 bg-zinc-50 px-4 py-5">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">Your communities</h2>
        <Image
          src="/icons/community.svg"
          alt="Your communities"
          width={24}
          height={24}
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
    </nav>
  )
}
