import { useEffect } from "react"
import prism from "prismjs"
import { toast } from "react-hot-toast"

import Image from "next/image"

export default function Code({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const handleCopy = async () => {
    await navigator?.clipboard?.writeText(code)
    toast.success("Copied to clipboard! 📋")
  }

  useEffect(() => {
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
    <pre className={`language-${language} !bg-zinc-700`}>
      <button
        onClick={() => void handleCopy()}
        className="absolute top-6 right-0.5 p-1 pr-0.5"
      >
        <Image
          src="/icons/code/clipboard.svg"
          alt="Code snippet background"
          width={17}
          height={17}
        />
      </button>
      <code>{code.trim()}</code>
    </pre>
  )
}
