import { createTRPCRouter, publicProcedure } from "./trpc";
import { workoutsRouter } from "./routers/workouts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: "hello world",
    };
  }),
  workouts: workoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
