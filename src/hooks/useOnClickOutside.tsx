import { useEffect } from "react"

type Props = {
  ref: React.RefObject<HTMLElement>
  handler: (event: MouseEvent | TouchEvent) => void
}

export default function useOnClickOutside({ ref, handler }: Props) {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return
      }
      handler(e)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}
