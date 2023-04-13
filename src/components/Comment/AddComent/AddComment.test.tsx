import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import AddComment from "./AddComent"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"

import { api } from "@/utils/api"
import { useCommentStore } from "@/components/Comment/store"
import { Comment } from "@/test/data/Comment"

import type { Mock } from "vitest"

vi.mock("@/utils/api", () => ({
  api: {
    comment: {
      create: {
        useMutation: () => vi.fn(),
      },
      reply: {
        useMutation: () => vi.fn(),
      },
    },
    useContext: () => ({}),
  },
}))

describe("AddComment", () => {
  window.HTMLElement.prototype.scrollIntoView = () => vi.fn()

  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({})
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedCreate = vi.spyOn(api.comment.create, "useMutation") as Mock
  mockedCreate.mockReturnValue({
    mutate: () => vi.fn(),
  })
  const mockedReply = vi.spyOn(api.comment.reply, "useMutation") as Mock
  mockedReply.mockReturnValue({
    mutate: () => vi.fn(),
  })

  const onClose = vi.fn()

  test("Renders add comment form", () => {
    render(<AddComment postId="1" onClose={onClose} />, {
      wrapper: withNextTRPC,
    })

    expect(screen.getByRole("form")).toBeTruthy()
    expect(
      screen.getByPlaceholderText(
        "Leave a comment, answer a question or share your thoughts..."
      )
    ).toBeTruthy()
  })

  test("Shows message if comment is too short", async () => {
    fireEvent.change(screen.getAllByRole("textbox")[0] as HTMLElement, {
      target: { value: "Short" },
    })
    fireEvent.submit(screen.getAllByRole("form")[0] as HTMLElement)

    await waitFor(() => {
      expect(
        screen.getByText("Comment is too short. (At least 10 characters).")
      ).toBeTruthy()
    })
  })

  test("Adds comment", () => {
    fireEvent.change(screen.getAllByRole("textbox")[0] as HTMLElement, {
      target: { value: "This is a test comment" },
    })
    expect(screen.getByText("Add comment")).toBeTruthy()
    fireEvent.submit(screen.getByRole("form"))

    expect(mockedCreate).toHaveBeenCalled()
  })

  test("Adds reply", () => {
    useCommentStore.setState({
      replyTo: Comment,
    })

    render(<AddComment postId="1" onClose={onClose} />, {
      wrapper: withNextTRPC,
    })

    expect(screen.getAllByText("John Doe")).toBeTruthy()
    expect(screen.getAllByText("Add reply")).toBeTruthy()

    fireEvent.change(screen.getAllByRole("textbox")[0] as HTMLElement, {
      target: { value: "This is a test reply" },
    })
    fireEvent.submit(screen.getAllByRole("form")[0] as HTMLElement)

    expect(mockedReply).toHaveBeenCalled()
  })
})
