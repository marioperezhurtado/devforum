import { ssg } from "@/server/api/root"
import { api } from "@/utils/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import ForumLayout from "@/layout/ForumLayout/ForumLayout"
import Avatar from "@/ui/Avatar"
import Button from "@/ui/Button"
import { toast } from "react-hot-toast"

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
  const { data: session, status: sessionStatus } = useSession()
  const utils = api.useContext()
  const router = useRouter()
  const { email } = router.query

  const { data: profile } = api.user.getByEmail.useQuery(email as string, {
    refetchOnWindowFocus: false,
  })

  const { data: following, isLoading: isFollowingLoading } =
    api.user.isFollowing.useQuery(
      {
        follower: session?.user.id ?? "",
        followee: profile?.id ?? "",
      },
      {
        enabled: sessionStatus === "authenticated",
        refetchOnWindowFocus: false,
      }
    )

  const { mutateAsync: followUser } = api.user.follow.useMutation({
    onSuccess: async () => {
      await utils.user.isFollowing.invalidate()
      await utils.user.getByEmail.invalidate(email as string)
    },
  })

  const { mutateAsync: unfollowUser } = api.user.unfollow.useMutation({
    onSuccess: async () => {
      await utils.user.isFollowing.invalidate()
      await utils.user.getByEmail.invalidate(email as string)
    },
  })

  const handleFollow = async () => {
    try {
      await toast.promise(followUser(profile?.id ?? ""), {
        loading: "Following user...",
        success: `Followed ${profile?.name ?? ""} 🙌`,
        error: "Failed to follow user",
      })
    } catch (e) {}
  }

  const handleUnfollow = async () => {
    try {
      try {
        await toast.promise(unfollowUser(profile?.id ?? ""), {
          loading: "Unfollowing user...",
          success: `Unfollowed ${profile?.name ?? ""} 🙇🏻‍♂️`,
          error: "Failed to unfollow user",
        })
      } catch (e) {}
    } catch (e) {}
  }

  const {
    followers: followerCount,
    posts: postCount,
    comments: commentCount,
    commentReactions: commentReactionCount,
    postReactions: postReactionCount,
  } = profile?._count ?? {}

  const reactionCount = (commentReactionCount ?? 0) + (postReactionCount ?? 0)
  const isOwnProfile = session?.user.email === profile?.email
  const isFollowing = !!following?.following?.length
  const isLoading = sessionStatus !== "authenticated" || isFollowingLoading

  return (
    <ForumLayout
      title={`${profile?.name ?? ""} - DevForum`}
      description={`${profile?.name ?? ""}'s profile on DevForum. Follow ${
        profile?.name ?? ""
      }, or find out about his latest posts and comments.`}
    >
      <div className="relative overflow-hidden rounded-md border bg-white shadow-md">
        <div className="h-28 bg-sky-600">
          <span className="absolute top-12 left-3 md:left-6">
            <Avatar
              imgUrl={profile?.image ?? ""}
              name={profile?.name ?? ""}
              size="xlarge"
            />
          </span>
        </div>
        <div className=" px-3 py-2 md:px-6 md:py-4">
          {!isLoading && !isOwnProfile && !isFollowing && (
            <Button
              authRequired
              onClick={() => void handleFollow()}
              className="absolute top-32 right-3 md:right-6"
            >
              Follow
            </Button>
          )}
          {!isLoading && !isOwnProfile && isFollowing && (
            <Button
              authRequired
              intent="secondary"
              onClick={() => void handleUnfollow()}
              className="absolute top-32 right-3 md:right-6"
            >
              Unfollow
            </Button>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <h1 className="text-lg font-bold text-zinc-700">
              {profile?.name ?? ""}
            </h1>
            ·<h2>{profile?.email ?? ""}</h2>
          </div>
          <div className="mt-5 flex gap-4 text-sm text-zinc-500">
            <p>
              {followerCount ?? 0}{" "}
              {followerCount === 1 ? "follower" : "followers"}
            </p>
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
