import { useState } from "react"

export default function usePrefetch(onPrefetch: () => void) {
  const [prefetched, setPrefetched] = useState(false)

  const handlePrefetch = () => {
    if (prefetched) return
    onPrefetch()
    setPrefetched(true)
  }

  return { handlePrefetch }
}
