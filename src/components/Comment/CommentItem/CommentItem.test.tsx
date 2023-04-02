import { describe, test, expect, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"
import { api } from "@/utils/api"

import CommentItem from "./CommentItem"
import { Comment } from "@/test/data/Comment"

import type { Mock } from "vitest"

vi.mock("@/utils/api", () => ({
  api: {
    useContext: vi.fn().mockReturnValue({}),
    commentReaction: {
      addOrUpdate: {
        useMutation: vi.fn().mockReturnValue({
          mutate: () => vi.fn(),
        }),
      },
      delete: {
        useMutation: vi.fn().mockReturnValue({
          mutate: () => vi.fn(),
        }),
      },
    },
    comment: {
      delete: {
        useMutation: vi.fn().mockReturnValue({
          mutateAsync: () => Promise.resolve(),
          isLoading: false,
        }),
      },
    },
  },
}))

describe("CommentItem", () => {
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({})
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })

  const mockedDelete = vi.spyOn(api.comment.delete, "useMutation") as Mock
  const mockedAddOrUpdate = vi.spyOn(
    api.commentReaction.addOrUpdate,
    "useMutation"
  ) as Mock

  test("Renders comment", () => {
    render(<CommentItem comment={Comment} allComments={[]} />)

    expect(screen.getByText("John Doe")).toBeTruthy()
    expect(screen.getByAltText("John Doe's profile picture")).toBeTruthy()
    expect(screen.getByText("Hello world")).toBeTruthy()
  })

  test("Can delete comment if is own", async () => {
    mockedUseSession.mockReturnValue({
      data: {
        user: {
          id: Comment.creator.id,
        },
      },
    })
    render(<CommentItem comment={Comment} allComments={[Comment]} />)

    const deleteBtn = screen.getByText("Delete")
    fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalled()
    })
  })

  test("Upvotes comment", async () => {
    const upvoteBtn = screen.getAllByTitle("Upvote")[1] as HTMLElement

    fireEvent.click(upvoteBtn)

    await waitFor(() => {
      expect(mockedAddOrUpdate).toHaveBeenCalled()
    })
  })

  test("Downvotes comment", async () => {
    const downvoteBtn = screen.getAllByTitle("Downvote")[1] as HTMLElement

    fireEvent.click(downvoteBtn)

    await waitFor(() => {
      expect(mockedAddOrUpdate).toHaveBeenCalled()
    })
  })

  test("Shows replies if there is any", () => {
    render(
      <CommentItem
        comment={Comment}
        allComments={[
          {
            ...Comment,
            id: "2",
            replyToId: Comment.id,
            content: "Reply to comment",
          },
        ]}
      />
    )

    expect(screen.getByText("Reply to comment")).toBeTruthy()
  })
})
