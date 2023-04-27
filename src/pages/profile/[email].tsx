import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Avatar from "@/ui/Avatar"
import Button from "@/ui/Button"

import type { GetStaticPaths, GetStaticProps } from "next"

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const email = ctx.params?.email
  if (!email)
    return {
      notFound: true,
    }

  const profile = await ssg.user.getByEmail.fetch(email as string)
  if (!profile)
    return {
      notFound: true,
    }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      revalidate: 60 * 5, // 5 minutes
    },
  }
}

export default function Profile() {
  const { data: profile } = api.user.getByEmail.useQuery(
    "marioph10@gmail.com",
    {
      refetchOnWindowFocus: false,
    }
  )

  const {
    posts: postCount,
    comments: commentCount,
    commentReactions: commentReactionCount,
    postReactions: postReactionCount,
  } = profile?._count ?? {}

  const reactionCount = (commentReactionCount ?? 0) + (postReactionCount ?? 0)

  return (
    <ForumLayout
      title={`${profile?.name ?? ""} - DevForum`}
      description={`${profile?.name ?? ""}'s profile on DevForum. Follow ${
        profile?.name ?? ""
      }, or find out about his latest posts and comments.`}
    >
      <div className="overflow-hidden rounded-md border bg-white shadow-md">
        <div className="relative h-28 bg-sky-600">
          <span className="absolute -bottom-10 left-3 md:left-6">
            <Avatar
              imgUrl={profile?.image ?? ""}
              name={profile?.name ?? ""}
              size="xlarge"
            />
          </span>
        </div>
        <div className=" px-3 py-2 md:px-6 md:py-4">
          <Button className="ml-auto block">Follow</Button>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <h1 className="text-lg font-bold text-zinc-700">
              {profile?.name ?? ""}
            </h1>
            ·<h2>{profile?.email ?? ""}</h2>
          </div>
          <div className="mt-5 flex gap-4 text-sm text-zinc-500">
            <p>
              {postCount ?? 0} {postCount === 1 ? "post" : "posts"}
            </p>
            <p>
              {commentCount ?? 0} {commentCount === 1 ? "comment" : "comments"}
            </p>
            <p>
              {reactionCount ?? 0} {reactionCount === 1 ? "vote" : "votes"}
            </p>
          </div>
        </div>
      </div>
    </ForumLayout>
  )
}
