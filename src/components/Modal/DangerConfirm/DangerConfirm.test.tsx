import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"

import DangerConfirm from "./DangerConfirm"

describe("DangerConfirm", () => {
  mockUseSession().mockReturnValue({ data: null })
  mockNextRouter()

  const onConfirm = vi.fn()

  test("Renders confirmation input and danger message", () => {
    render(
      <DangerConfirm
        confirmText="confirm-input"
        dangerMessage="danger-message"
        onConfirm={onConfirm}
        onClose={() => void {}}
      >
        <p>children</p>
      </DangerConfirm>
    )

    expect(screen.getByText("children")).toBeTruthy()
    expect(screen.getByText("confirm-input")).toBeTruthy()
    expect(screen.getByText("danger-message")).toBeTruthy()
  })

  test("Confirms only when confirmation input matches confirm text", () => {
    const input = screen.getByLabelText("Confirmation input")
    const button = screen.getByRole("button")

    fireEvent.click(button)

    expect(onConfirm).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: "confirm-input" } })
    fireEvent.click(button)

    expect(onConfirm).toHaveBeenCalled()
  })
})
