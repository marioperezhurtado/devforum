import { vi } from "vitest"

import * as UseVote from "@/hooks/useVote"

export default function mockNextRouter() {
  const mock = vi.fn()
  vi.spyOn(UseVote, "useVote").mockImplementation(mock)
  return mock
}
