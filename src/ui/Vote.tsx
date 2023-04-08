import { cva } from "class-variance-authority"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import Link from "next/link"

import type { VariantProps } from "class-variance-authority"

const vote = cva("button", {
  variants: {
    voted: {
      false: [
        "bg-zinc-100",
        "border-zinc-200",
        "text-zinc-600",
        "hover:bg-zinc-200",
        "hover:border-zinc-300",
      ],
    },
    voteType: {
      upvote: [],
      downvote: [],
    },
    size: {
      small: ["px-2", "py-0.5", "text-sm", "gap-0.5"],
      medium: ["px-2.5", "py-1", "text-sm", "gap-1"],
    },
  },
  defaultVariants: { size: "medium", voted: false },
  compoundVariants: [
    {
      voteType: "upvote",
      voted: true,
      className: "bg-sky-600 border-sky-600 text-sky-50",
    },
    {
      voteType: "downvote",
      voted: true,
      className: "bg-sky-200 border-sky-300 text-sky-700",
    },
  ],
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof vote> & {
    votes: number
  }

export default function Vote({
  voteType,
  voted,
  size,
  votes,
  className,
  ...props
}: ButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return (
      <Link href={`/signIn?redirectTo=${router.asPath}`}>
        <VoteItem
          voteType={voteType}
          voted={voted}
          size={size}
          votes={votes}
          className={className}
          disabled
          {...props}
        />
      </Link>
    )
  }

  return (
    <VoteItem
      voteType={voteType}
      voted={voted}
      size={size}
      votes={votes}
      className={className}
      {...props}
    />
  )
}

function VoteItem({
  voteType,
  voted,
  size,
  votes,
  className,
  ...props
}: ButtonProps) {
  let voteText = voteType === "upvote" ? "Upvote" : "Downvote"

  if (voted) {
    voteText = voteType === "upvote" ? "Remove upvote" : "Remove downvote"
  }

  return (
    <button
      title={voteText}
      className={`${vote({
        voteType,
        voted,
        size,
        className,
      })} flex items-center justify-center rounded-full border font-bold transition-all`}
      {...props}
    >
      {voteType === "upvote" && (
        <svg
          width="22px"
          height="22px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="py-0.5"
        >
          <g id="Upvote">
            <path
              id="Vector"
              d="M7 17L17 7M17 7H9M17 7V15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}
      {voteType === "downvote" && (
        <svg
          width="22px"
          height="22px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="py-0.5"
        >
          <g id="Downvote">
            <path
              id="Vector"
              d="M7 7L17 17M17 17V9M17 17H9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      )}
      {votes > 0 && votes}
    </button>
  )
}
