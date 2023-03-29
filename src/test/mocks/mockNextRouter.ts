import { vi } from "vitest"

import * as Router from "next/router"

export default function mockNextRouter() {
  const mock = vi.fn()
  vi.spyOn(Router, "useRouter").mockImplementation(mock)
  return mock
}
