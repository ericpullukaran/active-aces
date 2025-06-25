import { createTRPCRouter } from "./trpc"
import { workoutsRouter } from "./routers/workouts"
import { exercisesRouter } from "./routers/exercises"
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workouts: workoutsRouter,
  exercises: exercisesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
