import { cache } from "react"
import { createQueryClient } from "./query-client"
import { createCallerFactory, createTRPCContext } from "./trpc"
import { AppRouter, appRouter } from "./root"
import { headers } from "next/headers"
import { createHydrationHelpers } from "@trpc/react-query/rsc"

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set("x-trpc-source", "rsc")

  return await createTRPCContext({
    headers: heads,
  })
})

const getQueryClient = cache(createQueryClient)
const caller = appRouter.createCaller(await createContext())

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
)
