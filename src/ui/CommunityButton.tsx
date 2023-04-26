import Link from "next/link"

import type { RouterOutputs } from "@/utils/api"
type Community = NonNullable<RouterOutputs["community"]["getByName"]>

function getTextColor(hexColor: string): string {
  const [r, g, b] = hexColor.match(/\w\w/g)?.map((c) => parseInt(c, 16)) ?? [
    0, 0, 0,
  ]
  if (!r || !g || !b) return "#FFFFFF"

  const luminance = (0.2126 * r) / 255 + (0.7152 * g) / 255 + (0.0722 * b) / 255
  if (luminance > 0.5) {
    return "#000000" // black
  } else {
    return "#FFFFFF" // white
  }
}

export default function CommunityButton({
  community,
}: {
  community: Community
}) {
  return (
    <Link
      href={`/community/${community.name}`}
      className="mt-0.5 min-w-fit rounded-full px-2 py-0.5 text-sm font-bold text-green-50"
      style={{
        backgroundColor: `#${community.color}`,
        color: `${getTextColor(community.color)}`,
      }}
    >
      {community.name}
    </Link>
  )
}
