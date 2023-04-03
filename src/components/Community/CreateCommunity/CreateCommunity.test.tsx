import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import mockNextRouter from "@/test/mocks/mockNextRouter"
import mockUseSession from "@/test/mocks/mockUseSession"
import { api } from "@/utils/api"
import type { Mock } from "vitest"

import CreateCommunity from "./CreateCommunity"

vi.mock("@/utils/api", () => ({
  api: {
    community: {
      create: {
        useMutation: () => vi.fn(),
      },
    },
    useContext: () => ({}),
  },
}))

describe("CreateCommunity", () => {
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedSession = mockUseSession()
  mockedSession.mockReturnValue({
    data: {
      user: {
        id: 1,
      },
    },
  })
  const mockedCreate = vi.spyOn(api.community.create, "useMutation") as Mock

  test("Renders", () => {
    render(<CreateCommunity />)

    expect(screen.getByLabelText("Name")).toBeTruthy()
  })

  test("Shows form validation errors", async () => {
    const nameInput = screen.getByLabelText("Name")
    const descriptionInput = screen.getByLabelText("Description")
    const form = screen.getByRole("form")

    fireEvent.change(nameInput, { target: { value: "a" } })
    fireEvent.change(descriptionInput, { target: { value: "b" } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(
        screen.getByText("Name is too short. (At least 5 characters).")
      ).toBeTruthy()
      expect(
        screen.getByText("Description is too short. (At least 10 characters).")
      ).toBeTruthy()
    })
  })

  test("Creates community and redirects", async () => {
    const nameInput = screen.getByLabelText("Name")
    const descriptionInput = screen.getByLabelText("Description")
    const form = screen.getByRole("form")

    fireEvent.change(nameInput, { target: { value: "Valid Name" } })
    fireEvent.change(descriptionInput, {
      target: { value: "This is a valid description" },
    })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalled()
    })
  })
})
