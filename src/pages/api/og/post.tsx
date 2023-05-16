import { ImageResponse } from "@vercel/og"
import type { NextRequest } from "next/server"
import CommentsIcon from "@/assets/og/CommentsIcon"
import VotesIcon from "@/assets/og/VotesIcon"

export const config = {
  runtime: "edge",
}

const font = fetch(
  new URL("@/assets/work-sans-medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

export default async function PostOGImage(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const image = searchParams.get("image")
  const name = searchParams.get("name")
  const title = searchParams.get("title")
  const comments = searchParams.get("comments")
  const votes = searchParams.get("votes")

  const fontData = await font

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col pl-20 pt-32 pb-8 pr-12 text-xl text-zinc-700 bg-white"
        style={{
          fontFamily: "Work Sans",
          backgroundColor: "#fafafa",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #e4e4e7 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e4e4e7 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div tw="flex items-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="44"
            height="44"
            src={image ?? ""}
            alt="Profile picture"
            tw="rounded-full mr-4 aspect-square object-cover"
          />
          <span tw="font-bold text-2xl">{name}</span>
        </div>
        <h1 tw="text-sky-600 text-5xl">{title}</h1>

        <div tw="flex justify-between mt-auto">
          <div tw="flex text-4xl text-zinc-400">
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{votes}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <VotesIcon />
            </div>
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{comments}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <CommentsIcon />
            </div>
          </div>
          <span tw="font-bold text-4xl">
            <span tw="text-sky-600">Dev</span>Forum
          </span>
        </div>
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
