import { useEffect } from "react"
import prism from "prismjs"
import "prismjs/components/prism-typescript"

export default function Code({ code }: { code: string }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      prism.highlightAll()
    }
  }, [code])

  return (
    <pre className="language-typescript !bg-zinc-700">
      <code>{code.trim()}</code>
    </pre>
  )
}
