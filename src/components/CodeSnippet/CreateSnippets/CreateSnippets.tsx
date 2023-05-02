import { useSnippetsStore } from "./store"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import Image from "next/image"
import EditableCode from "@/components/CodeSnippet/EditableCode/EditableCode"
import SnippetTab from "@/components/CodeSnippet/SnippetTab/SnippetTab"
import AddSnippetDropdown from "./AddSnippetDropdown"

export default function CreateSnippets() {
  const { snippets, activeSnippet, isAdding, startAdding } = useSnippetsStore()

  const [listRef] = useAutoAnimate()

  return (
    <section className="relative mb-4 mt-2 rounded-md bg-zinc-600">
      <ul
        ref={listRef}
        className="flex w-fit items-center rounded-t text-xs font-semibold text-zinc-100"
      >
        <div className="flex items-center gap-1.5 border-r border-zinc-500 px-4 py-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        {snippets.map((s) => (
          <li key={s.id}>
            <SnippetTab snippet={s} />
          </li>
        ))}
        <li className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              startAdding()
            }}
            type="button"
            className="flex items-center justify-center p-1 transition hover:bg-zinc-500"
          >
            <Image
              src="/icons/add.svg"
              alt="Add snippet"
              width={16}
              height={16}
            />
          </button>
          {isAdding && <AddSnippetDropdown />}
        </li>
      </ul>
      {activeSnippet && <EditableCode />}
    </section>
  )
}
