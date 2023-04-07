import { useEffect } from "react"
import prism from "prismjs"
import { toast } from "react-hot-toast"

import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"
type Snippet = NonNullable<RouterOutputs["snippet"]["getById"]>

export default function Code({ snippet }: { snippet: Snippet }) {
  const { code, language } = snippet

  const handleCopy = async () => {
    await navigator?.clipboard?.writeText(code)
    toast.success("Copied to clipboard! 📋")
  }

  useEffect(() => {
    prism.highlightAll()
  }, [code])

  useEffect(() => {
    const importLanguage = async () => {
      await import(`prismjs/components/prism-${language.toLowerCase()}`)
      prism.highlightAll()
    }
    void importLanguage()
  }, [language])

  return (
    <pre className={`language-${language} !bg-zinc-700`}>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="absolute top-6 right-0.5 p-1 pr-0.5"
      >
        <Image
          src="/icons/clipboard.svg"
          alt="Code snippet background"
          width={17}
          height={17}
        />
      </button>
      <code>{code.trim()}</code>
    </pre>
  )
}
