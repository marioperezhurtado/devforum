import { describe, test, expect } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import Sidebar from "@/components/Sidebar/Sidebar"

import mockUseSession from "@/test/mocks/mockUseSession"
import { withNextTRPC } from "@/test/withNextTRPC"

describe("Sidebar", () => {
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({})

  test("Renders", () => {
    render(<Sidebar />, { wrapper: withNextTRPC })

    expect(screen.getByRole("complementary")).toBeTruthy()
  })

  test("Renders own list of communities only if IS logged in", async () => {
    expect(screen.queryByText("Your communities")).toBeFalsy()

    mockedUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
        },
      },
    })
    render(<Sidebar />, { wrapper: withNextTRPC })

    await waitFor(() =>
      expect(screen.getAllByText("Your communities")).toBeTruthy()
    )
  })
})
