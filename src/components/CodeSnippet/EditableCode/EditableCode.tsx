import { useEffect, useRef } from "react"
import prism from "prismjs"
import { useSnippetsStore } from "../CreateSnippets/store"
import { toast } from "react-hot-toast"

import Image from "next/image"

export default function Code() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { activeSnippet, updateSnippet } = useSnippetsStore()

  const code = activeSnippet.code
  const language = activeSnippet?.language ?? "JavaScript"

  const handleCopy = async () => {
    await navigator?.clipboard?.writeText(code)
    toast.success("Copied to clipboard! 📋")
  }

  const handleUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSnippet({ ...activeSnippet, code: e.target.value })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!textareaRef.current) return
    // Get the current position of the cursor
    const { selectionStart: start, selectionEnd: end } = textareaRef.current

    if (e.key === "Tab") {
      e.preventDefault()

      const newText =
        textareaRef.current.value.substring(0, start) +
        "  " +
        textareaRef.current.value.substring(end)

      textareaRef.current.value = newText
      textareaRef.current.setSelectionRange(start + 2, start + 2)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = code
    }
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
    <div className="relative">
      <textarea
        ref={textareaRef}
        defaultValue={code}
        onChange={handleUpdate}
        onKeyDown={handleKeyDown}
        className={`language-${language} absolute top-0 m-4 h-full w-full resize-none overflow-hidden !text-transparent caret-zinc-100
        outline-none`}
      />
      <pre
        className={`language-${language} overflow-auto rounded-b-md !bg-zinc-700`}
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="absolute top-1 right-0.5 p-1 pr-0.5"
      >
        <Image
          src="/icons/code/clipboard.svg"
          alt="Code snippet background"
          width={17}
          height={17}
        />
      </button>
    </div>
  )
}

// a bit hacky for now ¯\_(ツ)_/¯
// (hidden textarea placed on top of the code snippet that updates its content)
