import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import AddComment from "./AddComent"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"

import { api } from "@/utils/api"

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

vi.mock("@/pages/post/store", () => ({
  useCommentStore: () => ({
    replyTo: null,
  }),
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

  test("Adds comment", () => {
    fireEvent.change(screen.getAllByRole("textbox")[1] as HTMLElement, {
      target: { value: "This is a test comment" },
    })
    fireEvent.submit(screen.getByRole("form"))

    expect(mockedCreate).toHaveBeenCalled()
  })

  test("Adds reply", () => {
    fireEvent.change(screen.getAllByRole("textbox")[1] as HTMLElement, {
      target: { value: "This is a test comment" },
    })
    fireEvent.submit(screen.getByRole("form"))

    expect(mockedReply).toHaveBeenCalled()
  })
})
