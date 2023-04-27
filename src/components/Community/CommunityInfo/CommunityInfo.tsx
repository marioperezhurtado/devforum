import { api } from "@/utils/api"
import { useSession } from "next-auth/react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { toast } from "react-hot-toast"

import Button from "@/ui/Button"

import type { RouterOutputs } from "@/utils/api"
type Community = RouterOutputs["community"]["getByName"]

dayjs.extend(relativeTime)

export default function CommunityInfo({ community }: { community: Community }) {
  const { data: session, status: sessionStatus } = useSession()
  const utils = api.useContext()

  const { data: myCommunities, isFetching: communitiesLoading } =
    api.community.getAllByMember.useQuery(session?.user.id ?? "", {
      enabled: !!session,
      refetchOnWindowFocus: false,
    })

  const { mutateAsync: joinCommunity } = api.community.join.useMutation({
    onSuccess: async () => {
      await utils.community.getAllByMember.invalidate(session?.user.id ?? "")
    },
  })

  const { mutateAsync: leaveCommunity } = api.community.leave.useMutation({
    onSuccess: async () => {
      await utils.community.getAllByMember.invalidate(session?.user.id ?? "")
    },
  })

  const handleJoin = async () => {
    try {
      await toast.promise(joinCommunity(community?.name ?? ""), {
        loading: "Joining community...",
        success: `Welcome to ${community?.name ?? ""}! 🎉`,
        error: "Failed to join community",
      })
    } catch (e) {}
  }

  const handleLeave = async () => {
    try {
      await toast.promise(leaveCommunity(community?.name ?? ""), {
        loading: "Leaving community...",
        success: "See you anytime! 👋",
        error: "Failed to leave community",
      })
    } catch (e) {}
  }

  const isMember = myCommunities?.some((c) => c.name === community?.name)

  return (
    <div className="rounded-md border bg-white px-3 py-2 shadow-md md:px-6 md:py-4">
      <p className="mb-2 text-sm">Community</p>
      <div className="flex flex-wrap items-center gap-6 md:gap-8">
        <h1 className="break-words text-xl font-semibold md:text-2xl">
          {community?.name}
        </h1>
        {sessionStatus !== "loading" && !communitiesLoading && !isMember && (
          <Button authRequired onClick={() => void handleJoin()}>
            Join
          </Button>
        )}
        {isMember && (
          <Button
            authRequired
            onClick={() => void handleLeave()}
            intent="secondary"
          >
            Leave
          </Button>
        )}
      </div>
      <h2 className="mb-2 mt-3 md:mt-5 md:text-xl">{community?.description}</h2>
      <p className="text-right text-sm">
        Created on {dayjs(community?.createdAt).format("MM-DD-YYYY")}
      </p>
    </div>
  )
}
