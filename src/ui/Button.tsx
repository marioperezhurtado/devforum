import { cva } from "class-variance-authority"

import type { VariantProps } from "class-variance-authority"

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "bg-sky-600",
        "text-sky-100",
        "border-sky-600",
        "hover:border-sky-500",
        "hover:bg-sky-500",
      ],
      secondary: [
        "text-sky-600",
        "border-sky-600",
        "hover:border-sky-500",
        "hover:text-sky-500",
      ],
    },
    size: {
      small: ["px-2", "py-0.5", "text-xs"],
      medium: ["px-4", "py-1", "text-sm"],
    },
  },
  defaultVariants: { intent: "primary", size: "medium" },
})

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>

export default function Button({
  intent,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${button({
        intent,
        size,
        className,
      })} rounded-full border-2 font-semibold transition`}
      {...props}
    ></button>
  )
}
