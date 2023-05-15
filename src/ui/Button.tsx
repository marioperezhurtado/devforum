import { cva } from "class-variance-authority"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

import Link from "next/link"

import type { VariantProps } from "class-variance-authority"

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "!bg-sky-600",
        "text-sky-100",
        "border-sky-600",
        "hover:border-sky-500",
        "hover:!bg-sky-500",
      ],
      secondary: [
        "text-sky-600",
        "border-sky-600",
        "hover:border-sky-500",
        "hover:text-sky-500",
      ],
      danger: [
        "bg-red-600",
        "text-red-100",
        "border-red-600",
        "hover:border-red-500",
        "hover:bg-red-500",
      ],
    },
    size: {
      small: ["px-2", "py-0.5", "text-sm"],
      medium: ["px-4", "py-1", "text-sm"],
    },
    disabled: {
      true: ["opacity-50", "cursor-not-allowed"],
    },
  },
  defaultVariants: { intent: "primary", size: "medium" },
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    authRequired?: boolean
  }

export default function Button({
  intent,
  size,
  className,
  disabled,
  authRequired,
  ...props
}: ButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  if (authRequired && !session) {
    return (
      <Link href={`/signIn?redirectTo=${router.asPath}`}>
        <button
          className={`${button({
            intent,
            size,
            className,
            disabled,
          })} rounded-full border-2 font-semibold transition`}
          {...props}
          onClick={() => void {}}
        ></button>
      </Link>
    )
  }

  return (
    <button
      className={`${button({
        intent,
        size,
        className,
        disabled,
      })} rounded-full border-2 font-semibold transition`}
      {...props}
    ></button>
  )
}
