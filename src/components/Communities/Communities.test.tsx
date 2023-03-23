import { describe, test, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import Communities from "./Communities"

vi.mock("next-auth/react")

describe("Communities", async () => {
  const { useSession } = await import("next-auth/react")
  useSession.mockReturnValue({ data: false })

  test("Renders", () => {
    render(<Communities />)

    expect(screen.getByRole("complementary")).toBeTruthy()
  })

  test("Renders own communities if logged in", () => {
    expect(screen.queryByText("Your communities")).toBeFalsy()

    useSession.mockReturnValue({ data: true })
    render(<Communities />)

    expect(screen.getByText("Your communities")).toBeTruthy()
  })
})
