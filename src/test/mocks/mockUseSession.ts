import { vi } from "vitest"

import * as UseSession from "next-auth/react"

export default function mockUseSession() {
  const mock = vi.fn()
  vi.spyOn(UseSession, "useSession").mockImplementation(mock)
  return mock
}
