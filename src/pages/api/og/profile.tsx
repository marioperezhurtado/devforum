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

export default async function ProfileOGImage(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const name = searchParams.get("name")
  const email = searchParams.get("email")
  const image = searchParams.get("image")
  const followers = searchParams.get("followers")
  const posts = searchParams.get("posts")
  const comments = searchParams.get("comments")
  const votes = searchParams.get("votes")

  const fontData = await font

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col pl-20 pt-40 pb-8 pr-12 text-xl text-zinc-700 bg-white"
        style={{
          fontFamily: "Work Sans",
          backgroundColor: "#fafafa",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #e4e4e7 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e4e4e7 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
      >
        <div tw="flex justify-between items-center">
          <div tw="flex flex-col">
            <h1 tw="text-sky-600 text-7xl">{name}</h1>
            <h2 tw="text-zinc-400 text-4xl ml-2">{email}</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="200"
            height="200"
            src={image ?? ""}
            alt="Profile picture"
            tw="rounded-full"
          />
        </div>
        <div tw="flex justify-between mt-auto">
          <div tw="flex text-4xl text-zinc-400">
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{followers}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <FollowersIcon />
            </div>
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{posts}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <PostsIcon />
            </div>
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{comments}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <CommentsIcon />
            </div>
            <div tw="mr-14 flex items-center">
              <span tw="mr-2">{votes}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <VotesIcon />
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

const FollowersIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g>
        <path
          stroke="#a1a1aa"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M21 20c0-1.742-1.67-3.223-4-3.773M15 20c0-2.21-2.686-4-6-4s-6 1.79-6 4m12-7a4 4 0 000-8m-6 8a4 4 0 110-8 4 4 0 010 8z"
        ></path>
      </g>
    </svg>
  )
}

const PostsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 24 24"
    >
      <g>
        <path
          stroke="#a1a1aa"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M4 20h16M4 20v-4l8-8M4 20h4l8-8m-4-4l2.869-2.869.001-.001c.395-.395.593-.593.821-.667a1 1 0 01.618 0c.228.074.425.272.82.666l1.74 1.74c.396.396.594.594.668.822a1 1 0 010 .618c-.074.228-.272.426-.668.822h0L16 12.001m-4-4l4 4"
        ></path>
      </g>
    </svg>
  )
}
