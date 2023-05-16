import { describe, test, expect, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { withNextTRPC } from "@/test/withNextTRPC"
import mockUseSession from "@/test/mocks/mockUseSession"
import mockNextRouter from "@/test/mocks/mockNextRouter"

import CommunityInfo from "./CommunityInfo"

import { api } from "@/utils/api"

import type { Mock } from "vitest"

vi.mock("@/utils/api", () => ({
  api: {
    community: {
      join: {
        useMutation: () => ({
          mutateAsync: () => Promise.resolve(),
        }),
      },
      leave: {
        useMutation: () => ({
          mutateAsync: () => vi.fn(),
        }),
      },
      getAllByMember: {
        useQuery: () => ({
          data: [
            {
              name: "Joined Community",
            },
          ],
          isFetching: false,
        }),
      },
    },
    useContext: () => ({}),
  },
}))

const community = {
  name: "Not Joined Community",
  description: "Test description",
  createdAt: new Date("2077-01-02"),
  creatorId: "1",
  color: "#000000",
  _count: {
    members: 100,
    posts: 100,
  },
}

describe("CommunityInfo", () => {
  mockUseSession().mockReturnValue({
    data: {
      user: {
        id: "1",
      },
    },
  })
  mockNextRouter().mockReturnValue({
    push: () => vi.fn(),
  })
  const mockedJoin = vi.spyOn(api.community.join, "useMutation") as Mock
  mockedJoin.mockReturnValue({
    mutateAsync: () => Promise.resolve(),
  })
  const mockedLeave = vi.spyOn(api.community.leave, "useMutation") as Mock
  mockedLeave.mockReturnValue({
    mutateAsync: () => Promise.resolve(),
  })

  test("Renders community info", () => {
    render(<CommunityInfo community={community} />, {
      wrapper: withNextTRPC,
    })

    expect(screen.getByText(community.name)).toBeTruthy()
    expect(screen.getByText(community.description)).toBeTruthy()

    expect(screen.getByText("Community")).toBeTruthy()
    expect(screen.getByText("Created on 02 January 2077")).toBeTruthy()
  })

  test("Joins community", async () => {
    const joinBtn = screen.getByText("Join")
    fireEvent.click(joinBtn)

    await waitFor(() => {
      expect(mockedJoin).toHaveBeenCalled()
    })
  })

  test("Leaves community", async () => {
    render(
      <CommunityInfo
        community={{
          ...community,
          name: "Joined Community",
        }}
      />,
      {
        wrapper: withNextTRPC,
      }
    )

    const leaveBtn = screen.getByText("Leave")
    fireEvent.click(leaveBtn)

    await waitFor(() => {
      expect(mockedLeave).toHaveBeenCalled()
    })
  })
})
