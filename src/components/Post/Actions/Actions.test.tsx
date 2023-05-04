import { describe, test, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import { api } from "@/utils/api"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockNextRouter from "@/test/mocks/mockNextRouter"
import mockUseSession from "@/test/mocks/mockUseSession"
import { Post } from "@/test/data/Post"

import Actions from "./Actions"

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
    post: {
      delete: {
        useMutation: vi.fn().mockReturnValue({
          mutate: () => vi.fn(),
        }),
      },
    },
    useContext: () => ({}),
  },
}))

describe("Actions", () => {
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({
    user: {
      id: "1",
    },
  })
  const mockAddOrUpdate = vi.spyOn(
    api.postReaction.addOrUpdate,
    "useMutation"
  ) as Mock

  test("Renders actions", () => {
    render(<Actions post={Post} />, { wrapper: withNextTRPC })

    expect(screen.getByTitle("Upvote")).toBeTruthy()
    expect(screen.getByTitle("Downvote")).toBeTruthy()
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
