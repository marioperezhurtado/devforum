import { describe, test, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import AccountDropdown from "./AccountDropdown"
import mockUseSession from "@/test/mocks/mockUseSession"

describe("AccountDropdown", () => {
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({
    data: {
      user: {
        name: "Test User",
      },
    },
  })

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
