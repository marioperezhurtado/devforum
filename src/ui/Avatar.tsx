import Image from "next/image"

const SIZES = {
  small: {
    width: 24,
    className: "h-6 w-6",
  },
  medium: {
    width: 32,
    className: "h-8 w-8",
  },
  large: {
    width: 48,
    className: "h-12 w-12",
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
