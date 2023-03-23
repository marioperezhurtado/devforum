import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import AccountDropdown from "./AccountDropdown"

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        name: "Test User",
      },
    },
  }),
}))

describe("AccountDropdown", () => {
  test("Renders", () => {
    render(<AccountDropdown />)

    expect(screen.getByAltText("Your profile")).toBeTruthy()
  })

  test("Is closed by default", () => {
    expect(screen.queryByText("Test User")).toBeFalsy()
  })

  test("Toggles dropdown", () => {
    const btn = screen.getByRole("button")

    fireEvent.click(btn)
    expect(screen.getByText("Test User")).toBeTruthy()

    fireEvent.click(btn)
    expect(screen.queryByText("Test User")).toBeFalsy()
  })
})
