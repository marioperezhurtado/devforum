import Image from "next/image"
import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"
type User = Omit<NonNullable<RouterOutputs["user"]["getByEmail"]>, "_count">

const SIZES = {
  small: {
    width: 28,
    className: "h-7 w-7",
  },
  medium: {
    width: 36,
    className: "h-9 w-9",
  },
  large: {
    width: 64,
    className: "h-16 w-16",
  },
  xlarge: {
    width: 96,
    className: "h-24 w-24",
  },
}

export default function Avatar({
  user,
  size,
}: {
  user: User
  size: keyof typeof SIZES
}) {
  const { width, className } = SIZES[size]
  const { name, email, image } = user

  if (!image)
    return (
      <div
        className={`flex min-w-fit items-center justify-center rounded-full  bg-white ${className}`}
      >
        <span className="text-sm font-semibold text-zinc-400">
          {name?.[0]?.toUpperCase()}
        </span>
      </div>
    )

  return (
    <Link href={`/profile/${email ?? ""}`}>
      <Image
        src={image}
        alt={`${name ?? ""}'s profile picture`}
        width={width}
        height={width}
        className={`aspect-square min-w-fit rounded-full object-cover ${className}`}
      />
    </Link>
  )
}
