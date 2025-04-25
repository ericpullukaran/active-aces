import "server-only"

import { cache } from "react"
import { createQueryClient } from "./query-client"
import { createTRPCContext } from "./trpc"
import { appRouter } from "./root"
import { headers } from "next/headers"

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

export const getQueryClient = cache(createQueryClient)

export const api = appRouter.createCaller(createContext)
