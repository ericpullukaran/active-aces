"use client"

import { useState, useMemo } from "react"
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PersistQueryClientProvider, removeOldestQuery } from "@tanstack/react-query-persist-client"
import { httpBatchLink, createTRPCClient } from "@trpc/client"
import SuperJSON from "superjson"
import { createQueryClient } from "./query-client"
import { env } from "~/env"
import { type AppRouter } from "./root"
import { createTRPCContext } from "@trpc/tanstack-react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"

const {
  TRPCProvider: TRPCProviderTanstack,
  /* Provides queries with React Query hooks */
  useTRPC,
  /* Direct procedure caller for manual server requests without React Query features */
  useTRPCClient,
} = createTRPCContext<AppRouter>()
export { useTRPC, useTRPCClient }

const persister =
  typeof window !== "undefined"
    ? createAsyncStoragePersister({
        storage: window.localStorage,
        serialize: SuperJSON.stringify,
        deserialize: SuperJSON.parse,
        retry: removeOldestQuery,
      })
    : undefined

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

  const children = useMemo(
    () => (
      <TRPCProviderTanstack trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </TRPCProviderTanstack>
    ),
    [trpcClient, queryClient, props.children],
  )

  return persister ? (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        buster: env.VERCEL_GIT_COMMIT_SHA,
        maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days
      }}
    >
      {children}
    </PersistQueryClientProvider>
  ) : (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`
  return `http://localhost:3000`
}
