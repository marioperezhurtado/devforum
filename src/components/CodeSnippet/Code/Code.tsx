import { useEffect } from "react"
import prism from "prismjs"
import { toast } from "react-hot-toast"

import "prismjs/themes/prism-tomorrow.css"

import Editor from "react-simple-code-editor"
import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"
type Snippet = NonNullable<RouterOutputs["snippet"]["getById"]>

export default function Code({ snippet }: { snippet: Snippet }) {
  const code = snippet.code
  const language = snippet?.language ?? "JavaScript"

  const handleCopy = async () => {
    await navigator?.clipboard?.writeText(code)
    toast.success("Copied to clipboard! 📋")
  }

  const handleHighlight = (code: string) => {
    const grammar = prism.languages[language.toLowerCase()]
    if (!grammar) return code

    return prism.highlight(code, grammar, language.toLowerCase())
  }

  useEffect(() => {
    import(`prismjs/components/prism-${language.toLowerCase()}`)
  }, [language])

  return (
    <div className="relative">
      <Editor
        value={code}
        onValueChange={() => null}
        highlight={handleHighlight}
        padding={10}
        className="border bg-zinc-50"
      />
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="absolute right-0.5 top-1 rounded-full p-1 transition hover:bg-zinc-200"
      >
        <Image
          src="/icons/clipboard.svg"
          alt="Code snippet background"
          width={17}
          height={17}
        />
      </button>
    </div>
  )
}
