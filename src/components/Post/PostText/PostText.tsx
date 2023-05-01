import dynamic from "next/dynamic"

import styles from "./PostText.module.css"

const DynamicMarkdown = dynamic(
  () => import("markdown-to-jsx").then((markdown) => markdown),
  {
    ssr: false,
  }
)

export default function PostText({ text }: { text: string }) {
  return (
    <div
      className={`mt-5 whitespace-pre-wrap break-words ${
        styles.markdown ?? ""
      }`}
    >
      <DynamicMarkdown>{text}</DynamicMarkdown>
    </div>
  )
}
