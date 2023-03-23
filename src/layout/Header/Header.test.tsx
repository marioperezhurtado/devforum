import { test, describe, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import Header from "./Header"

vi.mock("next-auth/react")

describe("Header", async () => {
  const { useSession } = await import("next-auth/react")
  useSession.mockReturnValue({ data: false })

  test("Renders", () => {
    render(<Header />)

    expect(screen.getByText("Dev")).toBeTruthy()
    expect(screen.getByText("Forum")).toBeTruthy()
  })

  test("Renders create account and sign in buttons if user IS NOT logged in", () => {
    expect(screen.getByText("Create account")).toBeTruthy()
  })

  test("Renders account dropdown if user IS logged in", () => {
    useSession.mockReturnValueOnce({ data: true })

    render(<Header />)

    expect(screen.getByAltText("Your profile")).toBeTruthy()
  })
})
