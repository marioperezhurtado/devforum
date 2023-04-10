import { describe, test, expect, vi, type Mock } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"

import Sidebar from "@/layout/Sidebar/Sidebar"

import mockUseSession from "@/test/mocks/mockUseSession"
import { withNextTRPC } from "@/test/withNextTRPC"
import mockNextRouter from "@/test/mocks/mockNextRouter"

import { api } from "@/utils/api"

vi.mock("@/utils/api", () => ({
  api: {
    community: {
      getTrendingPreview: {
        useQuery: vi.fn().mockReturnValue({
          data: [{ name: "Trending 1" }, { name: "Trending 2" }],
          isLoading: false,
        }),
      },
      getDiscoverPreview: {
        useQuery: vi.fn().mockReturnValue({
          data: [{ name: "Discover 1" }, { name: "Discover 2" }],
          isLoading: false,
        }),
      },
      getAllByMember: {
        useQuery: vi.fn().mockReturnValue({
          data: [{ name: "My 1" }, { name: "My 2" }],
          isLoading: false,
        }),
      },
    },
    useContext: () => ({}),
  },
}))

describe("Sidebar", () => {
  const mockedUseSession = mockUseSession()
  mockedUseSession.mockReturnValue({})
  const mockedNextRouter = mockNextRouter()
  mockedNextRouter.mockReturnValue({
    push: () => vi.fn(),
  })

  const mockGetTrending = vi.spyOn(
    api.community.getTrendingPreview,
    "useQuery"
  ) as Mock
  const mockGetAllByMember = vi.spyOn(
    api.community.getAllByMember,
    "useQuery"
  ) as Mock

  test("Renders", () => {
    render(<Sidebar />, { wrapper: withNextTRPC })

    expect(screen.getByRole("complementary")).toBeTruthy()
  })

  test("Renders own list of communities only if IS logged in", async () => {
    expect(screen.queryByText("Your communities")).toBeFalsy()

    mockedUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
        },
      },
    })
    render(<Sidebar />, { wrapper: withNextTRPC })

    await waitFor(() =>
      expect(screen.getAllByText("Your communities")).toBeTruthy()
    )
  })

  test("Renders trending communities", async () => {
    await waitFor(() => {
      expect(screen.getAllByText("Trending")).toBeTruthy()
      expect(screen.getAllByText("Trending 1")).toBeTruthy()
      expect(screen.getAllByText("Trending 2")).toBeTruthy()
    })
  })

  test("Renders own communities", async () => {
    await waitFor(() => {
      expect(screen.getAllByText("Your communities")).toBeTruthy()
      expect(screen.getAllByText("My 1")).toBeTruthy()
      expect(screen.getAllByText("My 2")).toBeTruthy()
    })
  })

  test("Renders loading skeleton while loading", async () => {
    mockGetTrending.mockReturnValue({
      data: [{ name: "Trending 1" }, { name: "Trending 2" }],
      isLoading: true,
    })
    mockGetAllByMember.mockReturnValue({
      data: [{ name: "My 1" }, { name: "My 2" }],
      isLoading: true,
    })

    render(<Sidebar />, { wrapper: withNextTRPC })

    await waitFor(() => {
      expect(screen.getAllByText("Loading...")).toBeTruthy()
    })
  })

  test("Renders message if no communities are found", async () => {
    mockGetTrending.mockReturnValue({
      data: [],
      isLoading: false,
    })
    mockGetAllByMember.mockReturnValue({
      data: [],
      isLoading: false,
    })

    render(<Sidebar />, { wrapper: withNextTRPC })

    await waitFor(() => {
      expect(
        screen.getAllByText(
          "Sorry, we couldn't find any communities. Try again later."
        )
      ).toBeTruthy()
    })
    await waitFor(() => {
      expect(
        screen.getByText(
          "There's so much to discover! Join a community to get started."
        )
      ).toBeTruthy()
    })
  })
})
