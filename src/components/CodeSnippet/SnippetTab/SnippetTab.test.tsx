import { describe, test, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import SnippetTab from "./SnippetTab"

const snippet = {
  id: "1",
  language: "JavaScript",
  filename: "index",
  code: 'console.log("Hello World")',
  postId: "1",
  createdAt: new Date(),
} as const

describe("SnippetTab", () => {
  test("Renders", () => {
    render(<SnippetTab snippet={snippet} />)

    expect(screen.getByText("index")).toBeTruthy()
    expect(screen.getByAltText("JavaScript")).toBeTruthy()
    expect(screen.getByAltText("Remove snippet"))
  })

  test("Renames snippet", () => {
    const filename = screen.getByText("index")
    fireEvent.click(filename)
    fireEvent.change(filename, { target: { textContent: "index2" } })
    fireEvent.blur(filename)

    expect(screen.getByText("index2")).toBeTruthy()
  })
})
