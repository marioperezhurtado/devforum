import { api } from "@/utils/api"
import { useSession } from "next-auth/react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { toast } from "react-hot-toast"

import Button from "@/ui/Button"

import type { RouterOutputs } from "@/utils/api"
type Topic = NonNullable<RouterOutputs["topic"]["getByName"]>

dayjs.extend(relativeTime)

export default function TopicInfo({ topic }: { topic: Topic }) {
  const { data: session, status: sessionStatus } = useSession()
  const utils = api.useContext()

  const { data: followingTopics, isFetching: followingTopicsLoading } =
    api.topic.getAllByUser.useQuery(session?.user.id ?? "", {
      enabled: !!session,
      refetchOnWindowFocus: false,
    })

  const { mutateAsync: followTopic } = api.topic.follow.useMutation({
    onSuccess: async () => {
      await utils.topic.getAllByUser.invalidate(session?.user.id ?? "")
    },
  })

  const { mutateAsync: unfollowTopic } = api.topic.unfollow.useMutation({
    onSuccess: async () => {
      await utils.topic.getAllByUser.invalidate(session?.user.id ?? "")
    },
  })

  const handleFollow = async () => {
    try {
      await toast.promise(followTopic(topic?.name ?? ""), {
        loading: "Following topic...",
        success: `Followed #${topic?.name ?? ""} 👀`,
        error: "Failed to follow topic",
      })
    } catch (e) {}
  }

  const handleUnfollow = async () => {
    try {
      await toast.promise(unfollowTopic(topic?.name ?? ""), {
        loading: "Unfollowing topic...",
        success: `Unfollowed #${topic?.name} 🙅‍♂️`,
        error: "Failed to unfollow topic",
      })
    } catch (e) {}
  }

  const isFollowing = followingTopics?.some((t) => t.name === topic?.name)

  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
      <p className="mb-2 text-sm">Topic</p>
      <div className="mb-3 flex flex-wrap items-center gap-6">
        <h1 className="text-xl font-semibold md:text-2xl">#{topic.name}</h1>
        {sessionStatus !== "loading" &&
          !followingTopicsLoading &&
          !isFollowing && (
            <Button authRequired onClick={() => void handleFollow()}>
              Join
            </Button>
          )}
        {isFollowing && (
          <Button
            authRequired
            onClick={() => void handleUnfollow()}
            intent="secondary"
          >
            Leave
          </Button>
        )}
      </div>
      <p className="text-right text-sm">
        Created on {dayjs(topic.createdAt).format("MM-DD-YYYY")}
      </p>
    </div>
  )
}
