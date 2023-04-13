import { useEffect } from "react"
import { useSnippetsStore } from "@/components/CodeSnippet/CreateSnippets/store"
import prism from "prismjs"
import { toast } from "react-hot-toast"

import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-typescript"

import Editor from "react-simple-code-editor"
import Image from "next/image"

export default function EditableCode() {
  const { activeSnippet, updateSnippet } = useSnippetsStore()

  const code = activeSnippet.code
  const language = activeSnippet?.language ?? "JavaScript"

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
        onValueChange={(code) => updateSnippet({ ...activeSnippet, code })}
        highlight={handleHighlight}
        padding={10}
        className="border bg-zinc-50"
      />
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="absolute top-1 right-0.5 rounded-full p-1 transition hover:bg-zinc-200"
      >
        <Image
          src="/icons/clipboard.svg"
          alt="Copy to clipboard"
          width={17}
          height={17}
        />
      </button>
    </div>
  )
}
