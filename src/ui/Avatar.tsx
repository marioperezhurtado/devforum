import Image from "next/image"

const SIZES = {
  small: {
    width: 28,
    className: "h-7 w-7",
  },
  medium: {
    width: 40,
    className: "h-10 w-10",
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
  name,
  imgUrl,
  size,
}: {
  name: string
  imgUrl: string | null
  size: keyof typeof SIZES
}) {
  const { width, className } = SIZES[size]

  if (!imgUrl)
    return (
      <div
        className={`flex min-w-fit items-center justify-center rounded-full border bg-zinc-100 ${className}`}
      >
        <span className="text-sm font-semibold text-zinc-400">
          {name?.[0]?.toUpperCase()}
        </span>
      </div>
    )

  return (
    <Image
      src={imgUrl}
      alt={`${name}'s profile picture`}
      width={width}
      height={width}
      className={`min-w-fit rounded-full object-cover ${className}`}
    />
  )
}
