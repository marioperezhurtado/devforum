import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

import AddComment from "./AddComent"
import { withNextTRPC } from "@/test/withNextTRPC"
import { Comment } from "@/test/data/Comment"

import { api } from "@/utils/api"
import * as UseCommentStore from "@/pages/post/store"

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

  const mockedCreate = vi.spyOn(api.comment.create, "useMutation") as Mock
  mockedCreate.mockReturnValue({
    mutate: () => vi.fn(),
  })
  const mockedReply = vi.spyOn(api.comment.reply, "useMutation") as Mock
  mockedReply.mockReturnValue({
    mutate: () => vi.fn(),
  })
  const mockedUseCommentStore = vi.spyOn(
    UseCommentStore,
    "useCommentStore"
  ) as Mock

  const onClose = vi.fn()

  test("Renders add comment form", () => {
    render(<AddComment postId="1" onClose={onClose} />, {
      wrapper: withNextTRPC,
    })

    expect(screen.getByRole("form")).toBeTruthy()
    expect(screen.getByRole("textbox")).toBeTruthy()
  })

  test("Adds comment", () => {
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Test comment" },
    })
    fireEvent.submit(screen.getByRole("form"))

    expect(mockedCreate).toHaveBeenCalled()
  })

  test("Renders add comment form with reply", () => {
    mockedUseCommentStore.mockReturnValueOnce({
      replyTo: {
        Comment,
      },
    })

    render(<AddComment postId="1" onClose={onClose} />, {
      wrapper: withNextTRPC,
    })

    expect(screen.getAllByRole("form")).toBeTruthy()
    expect(screen.getAllByRole("textbox")).toBeTruthy()
  })

  test("Adds reply", () => {
    fireEvent.change(screen.getAllByRole("textbox")[1] as HTMLElement, {
      target: { value: "Test comment" },
    })
    fireEvent.submit(screen.getAllByRole("form")[1] as HTMLElement)

    expect(mockedReply).toHaveBeenCalled()
  })
})
