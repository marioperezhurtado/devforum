import { test, describe, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import Header from "./Header"

import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"

describe("Header", () => {
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({ data: false })
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })

  test("Renders", () => {
    render(<Header />)

    expect(screen.getByText("Dev")).toBeTruthy()
    expect(screen.getByText("Forum")).toBeTruthy()
  })

  test("Renders create account and sign in buttons if user IS NOT logged in", () => {
    expect(screen.getByText("Create account")).toBeTruthy()
  })

  test("Renders account dropdown if user IS logged in", () => {
    mockedUseSession.mockReturnValueOnce({
      data: true,
    })

    render(<Header />)

    expect(screen.getByAltText("Your profile")).toBeTruthy()
  })
})
