export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function shorten(str: string, len: number): string {
  const shortText = str.slice(0, len)

  const lines = shortText.split("\n")
  if (lines.length > 3) {
    return lines.slice(0, 3).join("\n") + "..."
  }

  return str.length > len ? str.slice(0, len) + "..." : str
}
