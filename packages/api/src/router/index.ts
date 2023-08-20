import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { exerciesRouter } from "./exercises";
import { userRouter } from "./user";
import { workoutsRouter } from "./workouts";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const appRouter = router({
  post: postRouter,
  user: userRouter,
  auth: authRouter,
  exercises: exerciesRouter,
  workouts: workoutsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type * from "./workouts";
