import { describe, test, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import PostPreviewItem from "./PostPreviewItem"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"
import { Post } from "@/test/data/Post"

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

describe("PostPreviewItem", () => {
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

  test("Renders post", () => {
    render(<PostPreviewItem post={Post} />, { wrapper: withNextTRPC })

    expect(screen.getByText("My Post")).toBeTruthy()
    expect(screen.getByText("My Content")).toBeTruthy()
    expect(screen.getByText("Test Community")).toBeTruthy()
    expect(screen.getByText("69")).toBeTruthy()
    expect(screen.getByText("John Doe")).toBeTruthy()
    expect(screen.getByAltText("John Doe's profile picture")).toBeTruthy()
    expect(screen.getByText("#Test Topic")).toBeTruthy()
    expect(screen.getByText("#Test Topic 2")).toBeTruthy()
  })

  test("Renders preview of post content", () => {
    render(
      <PostPreviewItem
        post={{
          ...Post,
          content: "My Content".repeat(100),
        }}
      />,
      { wrapper: withNextTRPC }
    )

    expect(screen.getByText("...")).toBeTruthy()
    expect(screen.queryByText("My Content".repeat(100))).toBeNull()
    expect(screen.getByText("Read more...")).toBeTruthy()
  })
})
