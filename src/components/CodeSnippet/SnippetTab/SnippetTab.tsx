import { useSnippetsStore } from "@/components/CodeSnippet/CreateSnippets/store"
import { langs } from "@/components/CodeSnippet/CreateSnippets/CreateSnippets"

import Image from "next/image"

import type { RouterOutputs } from "@/utils/api"
type Snippet = NonNullable<RouterOutputs["snippet"]["getById"]>

export default function SnippetTab({ snippet }: { snippet: Snippet }) {
  const { activeSnippet, changeActiveSnippet, updateSnippet, removeSnippet } =
    useSnippetsStore()

  const handleRename = (e: React.ChangeEvent<HTMLSpanElement>) => {
    updateSnippet({
      ...activeSnippet,
      filename:
        e.target.textContent === ""
          ? "Untitled"
          : e.target.textContent ?? "Untitled",
    })
  }

  return (
    <div
      key={snippet.id}
      className={`flex items-center border-r border-zinc-500 ${
        snippet.id === activeSnippet?.id ? "bg-zinc-700" : "bg-zinc-600"
      }`}
    >
      <button
        type="button"
        onClick={() => void changeActiveSnippet(snippet)}
        className="flex items-center gap-2 py-1 px-2"
      >
        <Image
          src={langs[snippet.language].logo}
          alt={snippet.language}
          width={12}
          height={12}
        />
        <p>
          <span
            onBlur={handleRename}
            contentEditable
            suppressContentEditableWarning
          >
            {snippet.filename}
          </span>
          .{langs[snippet.language].extension}
        </p>
      </button>
      <button
        onClick={() => void removeSnippet(snippet.id)}
        type="button"
        className="m-1 h-4 w-4 rounded-full transition hover:bg-zinc-500"
      >
        <Image
          src="/icons/close.svg"
          alt="Remove snippet"
          width={18}
          height={18}
        />
      </button>
    </div>
  )
}
