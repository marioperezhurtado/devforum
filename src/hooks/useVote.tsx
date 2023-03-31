import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

type Votes = {
  vote: boolean
  creatorId: string
}[]

type Props = {
  onUpvote: () => void
  onDownvote: () => void
  onRemoveVote: () => void
  votes: Votes
}

export default function useVote({
  onUpvote,
  onDownvote,
  onRemoveVote,
  votes,
}: Props) {
  const { data: session } = useSession()

  const [upvotes, setUpvotes] = useState(votes.filter((v) => v.vote).length)
  const [downvotes, setDownvotes] = useState(
    votes.filter((v) => !v.vote).length
  )
  const [myVote, setMyVote] = useState<boolean | null>(null)

  const handleUpvote = () => {
    if (myVote === true) {
      setUpvotes((u) => u - 1)
      setMyVote(null)
      onRemoveVote()
      return
    }
    if (myVote === false) {
      setDownvotes((d) => d - 1)
    }
    setUpvotes((u) => u + 1)
    setMyVote(true)
    onUpvote()
  }

  const handleDownvote = () => {
    if (myVote === false) {
      setDownvotes((d) => d - 1)
      setMyVote(null)
      onRemoveVote()
      return
    }
    if (myVote === true) {
      setUpvotes((u) => u - 1)
    }
    setDownvotes((d) => d + 1)
    setMyVote(false)
    onDownvote()
  }

  useEffect(() => {
    if (!session) return
    const myVote = votes.find((v) => v.creatorId === session.user.id)?.vote
    setMyVote(myVote ?? null)
  }, [session, votes])

  return { handleUpvote, handleDownvote, upvotes, downvotes, myVote }
}
