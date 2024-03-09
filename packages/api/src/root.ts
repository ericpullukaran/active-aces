import { authRouter } from "./router/auth";
import { exercisesRouter } from "./router/exercises";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  exercises: exercisesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
