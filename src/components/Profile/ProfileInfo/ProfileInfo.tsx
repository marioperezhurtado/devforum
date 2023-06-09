import { api } from "@/utils/api"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import dayjs from "dayjs"

import Button from "@/ui/Button"
import Banner from "@/components/Profile/Banner/Banner"
import EditProfile from "../EditProfile/EditProfile"

import type { RouterOutputs } from "@/utils/api"
type Profile = NonNullable<RouterOutputs["user"]["getByEmail"]>

export default function ProfileInfo({ profile }: { profile: Profile }) {
  const { data: session, status: sessionStatus } = useSession()
  const utils = api.useContext()

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
      await utils.user.getByEmail.invalidate(profile.email as string)
    },
  })

  const { mutateAsync: unfollowUser } = api.user.unfollow.useMutation({
    onSuccess: async () => {
      await utils.user.isFollowing.invalidate()
      await utils.user.getByEmail.invalidate(profile.email as string)
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
    <div className="relative overflow-hidden rounded-md border bg-white shadow-md">
      <Banner profile={profile} isOwn={isOwnProfile} />
      <div className=" px-3 py-2 md:px-6 md:py-4">
        {!isLoading && !isOwnProfile && !isFollowing && (
          <Button
            authRequired
            onClick={() => void handleFollow()}
            className="absolute right-3 top-32 md:right-6"
          >
            Follow
          </Button>
        )}
        {!isLoading && !isOwnProfile && isFollowing && (
          <Button
            authRequired
            intent="secondary"
            onClick={() => void handleUnfollow()}
            className="absolute right-3 top-32 md:right-6"
          >
            Unfollow
          </Button>
        )}

        {isOwnProfile && (
          <span className="absolute right-3 top-32 md:right-6">
            <EditProfile profile={profile} />
          </span>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <h1 className="text-lg font-bold text-zinc-700">
            {profile?.name ?? ""}
          </h1>
          ·<h2>{profile?.email ?? ""}</h2>
        </div>
        {profile.bio && <p className="mt-2">{profile.bio}</p>}
        <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4 text-sm text-zinc-500">
          <div className="flex flex-wrap gap-4">
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
          <p className="ml-auto">
            Joined on {dayjs(profile?.createdAt).format("DD MMMM YYYY")}
          </p>
        </div>
      </div>
    </div>
  )
}
