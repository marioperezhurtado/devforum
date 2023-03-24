import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"

type Posts = RouterOutputs["post"]["getFeatured"]

export default function PostPreviews({ posts }: { posts: Posts }) {
  console.log(posts[0])
  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.id}
          className="rounded-md border bg-white px-6 py-4 shadow-md"
        >
          <div className="flex justify-between">
            <h2 className="mb-3 text-lg font-semibold">{post.title}</h2>
            <Image
              src={post.creator.image ?? ""}
              alt={post.creator.name ?? ""}
              width={40}
              height={40}
              className="aspect-square h-10 w-10 min-w-fit rounded-full object-cover"
            />
          </div>
          <p>{post.content}</p>
          <div className="mt-3 flex justify-between text-sm">
            <span>{post.creator.name}</span>
            <span>{post.createdAt.toLocaleDateString()}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}
