import { workoutService } from "~/lib/services/workout-service"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from "zod"
import { PutWorkoutSchema } from "~/lib/types/workout"
import { workoutsHistoryRouter } from "./workoutsHistory"

export const workoutsRouter = createTRPCRouter({
  history: workoutsHistoryRouter,

  put: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        workout: PutWorkoutSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await workoutService.putWorkout(ctx.db, {
        id: input.id,
        workout: input.workout,
        userId: ctx.auth.userId,
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await workoutService.deleteWorkout(ctx.db, {
        id: input.id,
        userId: ctx.auth.userId,
      })
    }),
})
