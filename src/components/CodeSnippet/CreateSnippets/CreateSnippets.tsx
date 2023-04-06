import { useSnippetsStore } from "./store"

import Image from "next/image"
import EditableCode from "@/components/CodeSnippet/EditableCode/EditableCode"

const langs = {
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
    changeActiveSnippet,
    removeSnippet,
    addSnippet,
  } = useSnippetsStore()

  const handleAddSnippet = () => {
    addSnippet({
      id: "123",
      postId: "123",
      language: "TypeScript",
      filename: "script",
      code: `
`,
      createdAt: new Date(),
    })
  }

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
              className="px-2 py-1 transition"
            >
              x
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleAddSnippet}
            type="button"
            className="px-2 py-0.5 text-sm transition"
          >
            +
          </button>
        </li>
      </ul>
      {activeSnippet && <EditableCode />}
    </section>
  )
}
