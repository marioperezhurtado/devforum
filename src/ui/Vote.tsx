import { cva } from "class-variance-authority"

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
      small: ["h-6", "w-8", "text-xs", "gap-0.5"],
      medium: ["h-7", "w-9", "text-sm", "gap-1"],
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
    {
      size: "small",
      voted: true,
      className: "w-9",
    },
    {
      size: "medium",
      voted: true,
      className: "w-[46px]",
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
  return (
    <button
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
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
          width="16px"
          height="16px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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

/*
className="flex items-center gap-1 rounded-full border bg-zinc-100 py-1 px-2 font-semibold text-zinc-600 transition hover:bg-zinc-200"
            */
