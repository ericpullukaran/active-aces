import { authRouter } from "./router/auth";
import { exercisesRouter } from "./router/exercises";
import { workoutsRouter } from "./router/workouts";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  exercises: exercisesRouter,
  workouts: workoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
