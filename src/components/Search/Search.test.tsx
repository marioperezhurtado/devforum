import { describe, test, expect, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import Search from "./Search"

import mockNextRouter from "@/test/mocks/mockNextRouter"
import { withNextTRPC } from "@/test/withNextTRPC"
import { api } from "@/utils/api"

import type { Mock } from "vitest"

vi.mock("@/utils/api", () => ({
  api: {
    post: {
      searchByTitlePreview: {
        useQuery: () => ({
          data: [],
          isFetching: false,
        }),
      },

      useContext: () => ({}),
    },
  },
}))

describe("Search", () => {
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedSearchByTitlePreview = vi.spyOn(
    api.post.searchByTitlePreview,
    "useQuery"
  ) as Mock
  mockedSearchByTitlePreview.mockReturnValue({
    data: [
      {
        id: "1",
        title: "My Post",
      },
      {
        id: "2",
        title: "My Post 2",
      },
      {
        id: "3",
        title: "My Post 3",
      },
      {
        id: "4",
        title: "My Post 4",
      },
      {
        id: "5",
        title: "My Post 5",
      },
    ],
    isFetching: false,
  })

  test("Renders", () => {
    render(<Search />, { wrapper: withNextTRPC })
    expect(screen.getByPlaceholderText("Start exploring...")).toBeTruthy()
    expect(screen.getAllByRole("searchbox")).toBeTruthy()
  })

  test("Searchs when 4 letters are typed", () => {
    const searchInput = screen.getByPlaceholderText("Start exploring...")

    fireEvent.focus(searchInput)
    expect(screen.queryByText("My Post")).toBeFalsy()

    fireEvent.change(searchInput, { target: { value: "abcd" } })
    expect(screen.getByText("My Post")).toBeTruthy()
    expect(screen.getByText("See all results")).toBeTruthy()
  })

  test("Shows loading spinner while searching", () => {
    mockedSearchByTitlePreview.mockReturnValue({
      data: [],
      isFetching: true,
    })
    expect(screen.queryByRole("status")).toBeFalsy()

    render(<Search />, { wrapper: withNextTRPC })

    expect(screen.getByRole("status")).toBeTruthy()
  })

  test("Shows no results found", async () => {
    mockedSearchByTitlePreview.mockReturnValue({
      data: [],
      isFetching: false,
    })
    expect(screen.queryByText("No results found")).toBeFalsy()

    render(<Search />, { wrapper: withNextTRPC })

    await waitFor(() => {
      expect(screen.getByText("No results found.")).toBeTruthy()
    })
  })
})
