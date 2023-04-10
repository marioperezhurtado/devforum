import { useSnippetsStore } from "./store"

import Image from "next/image"
import EditableCode from "@/components/CodeSnippet/EditableCode/EditableCode"
import SnippetTab from "@/components/CodeSnippet/SnippetTab/SnippetTab"
import AddSnippetDropdown from "./AddSnippetDropdown"

export const langs = {
  JavaScript: {
    logo: "/icons/code/js.svg",
    extension: "js",
  },
  TypeScript: {
    logo: "/icons/code/ts.svg",
    extension: "ts",
  },
  Python: {
    logo: "/icons/code/py.svg",
    extension: "py",
  },
  Rust: {
    logo: "/icons/code/rs.svg",
    extension: "rs",
  },
}

export default function CreateSnippets() {
  const { snippets, activeSnippet, isAdding, startAdding } = useSnippetsStore()

  return (
    <section className="relative mt-2 mb-4 rounded-md bg-zinc-600">
      <ul className="flex w-fit items-center rounded-t text-xs font-semibold text-zinc-100">
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
            onClick={startAdding}
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