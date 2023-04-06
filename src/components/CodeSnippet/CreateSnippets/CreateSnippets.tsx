import { useSnippetsStore } from "./store"

import Image from "next/image"
import EditableCode from "@/components/CodeSnippet/EditableCode/EditableCode"
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
  const {
    snippets,
    activeSnippet,
    isAdding,
    changeActiveSnippet,
    removeSnippet,
    startAdding,
  } = useSnippetsStore()

  return (
    <section className="relative mt-2 rounded-md bg-zinc-600">
      <ul className="flex w-fit items-center rounded-t text-xs font-semibold text-zinc-100">
        <div className="flex items-center gap-1.5 border-r border-zinc-500 px-4 py-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        {snippets.map((s) => (
          <li
            key={s.id}
            className={`flex items-center border-r border-zinc-500 
               ${s.id !== activeSnippet?.id ? "bg-zinc-600" : "bg-zinc-700"}`}
          >
            <button
              type="button"
              onClick={() => void changeActiveSnippet(s)}
              className="flex items-center gap-2 py-1 px-2"
            >
              <Image
                src={langs[s.language].logo}
                alt={s.language}
                width={12}
                height={12}
              />
              {s.filename}.{langs[s.language].extension}
            </button>
            <button
              onClick={() => void removeSnippet(s.id)}
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
