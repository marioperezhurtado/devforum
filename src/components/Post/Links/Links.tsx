import Link from "next/link"
import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"
type Post = NonNullable<RouterOutputs["post"]["getById"]>

export default function Links({ post }: { post: Post }) {
  console.log(post)

  return (
    <ul className="mt-5 flex flex-wrap items-center justify-end gap-1 text-xs font-semibold">
      {post.demoUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-green-600 px-2.5 py-1 text-slate-50"
          >
            <Image
              src="/icons/link.svg"
              alt="Live Demo"
              width={20}
              height={20}
              className="p-0.5"
            />
            Live Demo
          </Link>
        </li>
      )}
      {post.githubUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-zinc-600 px-2.5 py-1 text-zinc-50"
          >
            <Image
              src="/icons/github.svg"
              alt="Github Repo"
              width={20}
              height={20}
            />
            Github Repo
          </Link>
        </li>
      )}
      {post.discordUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-[#5766e3] px-2.5 py-1 text-indigo-50"
          >
            <Image
              src="/icons/discord.svg"
              alt="Discord"
              width={20}
              height={20}
              className="p-0.5"
            />
            Discord
          </Link>
        </li>
      )}
      {post.twitterUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-cyan-600 px-2.5 py-1 text-sky-50"
          >
            <Image
              src="/icons/twitter.svg"
              alt="Twitter"
              width={20}
              height={20}
              className="p-0.5"
            />
            Twitter
          </Link>
        </li>
      )}
      {post.redditUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-orange-600 px-2.5 py-1 text-orange-50"
          >
            <Image
              src="/icons/reddit.svg"
              alt="Reddit"
              width={20}
              height={20}
            />
            Reddit
          </Link>
        </li>
      )}
      {post.youtubeUrl && (
        <li>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 rounded-full bg-red-600 px-2.5 py-1 text-red-50"
          >
            <Image
              src="/icons/youtube.svg"
              alt="YouTube"
              width={20}
              height={20}
            />
            YouTube
          </Link>
        </li>
      )}
    </ul>
  )
}
