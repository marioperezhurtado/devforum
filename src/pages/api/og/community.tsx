import { ImageResponse } from "@vercel/og"
import type { NextRequest } from "next/server"

export const config = {
  runtime: "edge",
}

const font = fetch(
  new URL("@/assets/work-sans-medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

export default async function CommunityOGImage(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const name = searchParams.get("name")
  const description = searchParams.get("description")

  const fontData = await font

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col pl-20 pt-32 pb-8 pr-14 text-xl text-zinc-700 bg-white"
        style={{
          fontFamily: "Work Sans",
          backgroundColor: "#fafafa",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #e4e4e7 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e4e4e7 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <span tw="font-bold text-2xl mb-10 ml-2">Community</span>
        <h1 tw="text-sky-600 text-7xl">{name}</h1>
        <h2 tw="text-zinc-400 text-4xl ml-2">{description}</h2>
        <span tw="ml-auto mt-auto font-bold text-4xl">
          <span tw="text-sky-600">Dev</span>Forum
        </span>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Work Sans",
          data: fontData,
          style: "normal",
        },
      ],
    }
  )
}
