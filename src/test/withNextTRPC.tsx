import { httpBatchLink } from "@trpc/react-query"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import type { PropsWithChildren } from "react"
import type { AppRouter } from "@/server/api/root"

export const trpcReact = createTRPCReact<AppRouter>({})
const queryClient = new QueryClient({})

const url = `http://localhost:${process.env.PORT ?? 3000}/api/trpc`

const trpcClient = trpcReact.createClient({
  links: [httpBatchLink({ url })],
  transformer: superjson,
})

export const withNextTRPC = ({ children }: PropsWithChildren) => (
  <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </trpcReact.Provider>
)
