import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import { TRPCClientError } from "@trpc/client"
import SuperJSON from "superjson"

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
        // Set gcTime to control how long queries stay in cache
        // This should match or exceed the persister's maxAge
        gcTime: 1000 * 60 * 60 * 24 * 15, // 15 days
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
      mutations: {
        onError(error) {
          if (error instanceof TRPCClientError) {
            console.error(error.message)
          } else {
            console.error(`Unexpected error: ${error.message}`)
          }
        },
      },
    },
  })
