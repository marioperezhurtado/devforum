import { create } from "zustand"

import type { RouterOutputs } from "@/utils/api"
type Snippet = NonNullable<RouterOutputs["snippet"]["getById"]>

type SnippetsState = {
  snippets: Snippet[]
  activeSnippet: Snippet
  changeActiveSnippet: (snippet: Snippet) => void
  updateSnippet: (snippet: Snippet) => void
  removeSnippet: (id: string) => void
  addSnippet: (newSnippet: Snippet) => void
}

const dummySnippets: Snippet[] = [
  {
    id: "1",
    postId: "1",
    filename: "index",
    language: "JavaScript" as const,
    code: `// Paste your code here, or just type it in!
console.log('Hello World!')
// You can also create other snippets in your favourite languages ツ
`,
    createdAt: new Date(),
  },
  {
    id: "2",
    postId: "1",
    filename: "main",
    language: "Python" as const,
    code: "print('Hello World!')",
    createdAt: new Date(),
  },
]

export const useSnippetsStore = create<SnippetsState>((set) => ({
  snippets: dummySnippets,
  activeSnippet: dummySnippets[0] as Snippet,
  changeActiveSnippet: (snippet) => {
    set({ activeSnippet: snippet })
  },
  updateSnippet: (snippet) => {
    set((state) => ({
      snippets: state.snippets.map((s) => (s.id === snippet.id ? snippet : s)),
      activeSnippet: snippet,
    }))
  },
  removeSnippet: (id) => {
    set((state) => ({
      snippets: state.snippets.filter((s) => s.id !== id),
    }))
    set((state) => ({
      activeSnippet: state.snippets[0],
    }))
  },
  addSnippet: (newSnippet: Snippet) => {
    set((state) => {
      return {
        snippets: [...state.snippets, newSnippet],
      }
    })
    set(() => ({
      activeSnippet: newSnippet,
    }))
  },
}))
