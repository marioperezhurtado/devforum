import { useRef } from "react"
import { useSnippetsStore } from "./store"
import useOnClickOutside from "@/hooks/useOnClickOutside"
import { langs } from "@/components/CodeSnippet/langs"

import Image from "next/image"

type Lang = keyof typeof langs

export default function AddSnippetDropdown() {
  const ref = useRef<HTMLDivElement>(null)
  const addSnippet = useSnippetsStore((state) => state.addSnippet)
  const stopAdding = useSnippetsStore((state) => state.stopAdding)

  useOnClickOutside({
    ref,
    handler: stopAdding,
  })

  const handleAddSnippet = (language: Lang) => {
    addSnippet({
      id: Math.random().toString(),
      postId: "",
      filename: "Untitled",
      language,
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
      {Object.keys(langs).map((lang) => (
        <button
          key={lang}
          onClick={() => handleAddSnippet(lang as Lang)}
          type="button"
          className="flex items-center gap-1 rounded-t-md border-b border-r border-zinc-500 px-2 py-1"
        >
          <Image
            src={langs[lang as Lang].logo}
            alt={lang}
            width={18}
            height={18}
          />
          {lang}
        </button>
      ))}
    </div>
  )
}
