import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import mockNextRouter from "@/test/mocks/mockNextRouter"
import mockUseSession from "@/test/mocks/mockUseSession"
import { api } from "@/utils/api"
import type { Mock } from "vitest"

import CreatePost from "./CreatePost"

vi.mock("@/utils/api", () => ({
  api: {
    post: {
      create: {
        useMutation: () => ({
          mutateAsync: vi.fn(),
        }),
      },
    },
    community: {
      getAllByMember: {
        useQuery: () => ({
          data: [
            {
              id: "1",
              name: "Test Community",
            },
          ],
        }),
      },
    },
    useContext: () => ({}),
  },
}))

describe("CreatePost", () => {
  mockNextRouter().mockReturnValue({
    push: () => vi.fn(),
  })
  mockUseSession().mockReturnValue({
    user: {
      id: "1",
    },
  })
  const mockedCreate = vi.spyOn(api.post.create, "useMutation") as Mock

  test("Renders", () => {
    render(<CreatePost />)

    expect(screen.getByLabelText("Title")).toBeTruthy()
    expect(screen.getByLabelText("Content")).toBeTruthy()
    expect(screen.getByLabelText("Community")).toBeTruthy()
  })

  test("Shows form validation errors", async () => {
    const titleInput = screen.getByLabelText("Title")
    const contentInput = screen.getByLabelText("Content")
    const form = screen.getByRole("form")

    fireEvent.change(titleInput, { target: { value: "a" } })
    fireEvent.change(contentInput, { target: { value: "b" } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(
        screen.getByText("Title is too short. (At least 10 characters).")
      ).toBeTruthy()
      expect(
        screen.getByText("Content is too short. (At least 50 characters).")
      ).toBeTruthy()
      expect(screen.getByText("Please select a community.")).toBeTruthy()
    })
  })

  test("Renders list of topics as you write the content", async () => {
    const contentTextarea = screen.getByLabelText("Content")
    fireEvent.change(contentTextarea, {
      target: {
        value: "Test content with a #topic and #another",
      },
    })

    await waitFor(() => {
      expect(screen.getByText("#topic, #another")).toBeTruthy()
    })
  })

  test("Creates post and redirects", async () => {
    const titleInput = screen.getByLabelText("Title")
    const contentInput = screen.getByLabelText("Content")
    const form = screen.getByRole("form")

    fireEvent.change(titleInput, { target: { value: "This is a valid title" } })
    fireEvent.change(contentInput, {
      target: {
        value: "This is a valid content. Lorem ipsum dolor sil atmet.",
      },
    })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalled()
    })
  })
})
