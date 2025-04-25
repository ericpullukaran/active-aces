"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, createTRPCClient } from "@trpc/client"
import SuperJSON from "superjson"
import { createQueryClient } from "./query-client"
import { env } from "~/env"
import { AppRouter } from "./root"
import { createTRPCContext } from "@trpc/tanstack-react-query"

const {
  TRPCProvider: TRPCProviderTanstack,
  /* Provides queries with React Query hooks */
  useTRPC,
  /* Direct procedure caller for manual server requests without React Query features */
  useTRPCClient,
} = createTRPCContext<AppRouter>()
export { useTRPC, useTRPCClient }

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient())
}

export function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          async headers() {
            const headers = new Headers()
            headers.set("x-trpc-source", "nextjs-react")
            return headers
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProviderTanstack trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProviderTanstack>
    </QueryClientProvider>
  )
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return `http://localhost:3000`
}
