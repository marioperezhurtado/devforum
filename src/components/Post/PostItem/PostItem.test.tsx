import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import PostItem from "./PostItem"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"
import { Post } from "@/test/data/Post"

import { api } from "@/utils/api"

import type { Mock } from "vitest"

vi.mock("@/utils/api", () => ({
  api: {
    postReaction: {
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
  },
}))

describe("PostItem", () => {
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({
    user: {
      id: "1",
      username: "John Doe",
    },
  })

  const mockAddOrUpdate = vi.spyOn(
    api.postReaction.addOrUpdate,
    "useMutation"
  ) as Mock

  test("Renders post", () => {
    render(<PostItem post={Post} />, { wrapper: withNextTRPC })

    expect(screen.getByText("My Post")).toBeTruthy()
    expect(screen.getByText("My Content")).toBeTruthy()
    expect(screen.getByText("Test Community")).toBeTruthy()
    expect(screen.getByText("69")).toBeTruthy()
    expect(screen.getByText("John Doe")).toBeTruthy()
    expect(screen.getByAltText("John Doe's profile picture")).toBeTruthy()
    expect(screen.getByText("#Test Topic")).toBeTruthy()
    expect(screen.getByText("#Test Topic 2")).toBeTruthy()
  })

  test("Upvotes post", async () => {
    const upvoteBtn = screen.getByTitle("Upvote")

    fireEvent.click(upvoteBtn)

    await waitFor(() => {
      expect(mockAddOrUpdate).toHaveBeenCalled()
    })
  })

  test("Downvotes post", async () => {
    const downvoteBtn = screen.getByTitle("Downvote")

    fireEvent.click(downvoteBtn)

    await waitFor(() => {
      expect(mockAddOrUpdate).toHaveBeenCalled()
    })
  })
})
