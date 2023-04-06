import { useState } from "react"

import Image from "next/image"
import Code from "@/components/CodeSnippet/Code/Code"

import type { RouterOutputs } from "@/utils/api"
type Snippets = RouterOutputs["snippet"]["getByPost"]

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

export default function CodeSnippets({ snippets }: { snippets: Snippets }) {
  const [activeSnippet, setActiveSnippet] = useState(snippets[0])

  return (
    <section className="relative mt-5 overflow-hidden rounded-md bg-zinc-600">
      <ul className="flex w-fit rounded-t text-xs font-semibold text-zinc-100">
        <div className="flex items-center gap-1.5 border-r border-zinc-500 px-4">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        {snippets.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => void setActiveSnippet(s)}
              className={`flex items-center gap-2 border-r border-zinc-500 px-3 py-1  
               ${s.id !== activeSnippet?.id ? "bg-zinc-600" : "bg-zinc-700"}`}
            >
              <Image
                src={langs[s.language].logo}
                alt={s.language}
                width={12}
                height={12}
              />
              {s.filename}.{langs[s.language].extension}
            </button>
          </li>
        ))}
      </ul>
      {activeSnippet && <Code snippet={activeSnippet} />}
    </section>
  )
}
