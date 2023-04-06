import { useRef } from "react"
import { useSnippetsStore } from "./store"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import { langs } from "./CreateSnippets"

import Image from "next/image"

type Lang = keyof typeof langs

export default function AddSnippetDropdown() {
  const ref = useRef<HTMLDivElement>(null)
  const stopAdding = useSnippetsStore((state) => state.stopAdding)
  const addSnippet = useSnippetsStore((state) => state.addSnippet)

  useOnClickOutside({
    ref,
    handler: stopAdding,
  })

  const handleAddSnippet = (language: Lang) => {
    addSnippet({
      id: "",
      postId: "",
      language,
      filename: "new_snippet",
      code: `
`,
      createdAt: new Date(),
    })
    stopAdding()
  }

  return (
    <div
      ref={ref}
      className="absolute bottom-0 flex w-28 flex-col rounded-t-md bg-zinc-600"
    >
      <button
        onClick={() => handleAddSnippet("JavaScript")}
        type="button"
        className="flex gap-1 rounded-t-md border-r border-b border-zinc-500 px-2 py-1"
      >
        <Image
          src={langs.JavaScript.logo}
          alt="JavaScript"
          width={14}
          height={14}
        />
        JavaScript
      </button>
      <button
        onClick={() => handleAddSnippet("TypeScript")}
        type="button"
        className="flex gap-1 border-r border-b border-zinc-500 px-2 py-1"
      >
        <Image
          src={langs.TypeScript.logo}
          alt="TypeScript"
          width={14}
          height={14}
        />
        TypeScript
      </button>
      <button
        onClick={() => handleAddSnippet("Python")}
        type="button"
        className="flex gap-1 border-r border-b border-zinc-500 px-2 py-1"
      >
        <Image src={langs.Python.logo} alt="Python" width={14} height={14} />
        Python
      </button>
      <button
        onClick={() => handleAddSnippet("Rust")}
        type="button"
        className="flex gap-1 border-r border-b border-zinc-500 px-2 py-1"
      >
        <Image src={langs.Rust.logo} alt="Rust" width={14} height={14} />
        Rust
      </button>
    </div>
  )
}
