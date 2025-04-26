import { workoutService } from "~/lib/services/workout-service"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from "zod"
import { PutWorkoutSchema } from "~/lib/types/workout"

export const workoutsRouter = createTRPCRouter({
  history: protectedProcedure.query(async ({ ctx }) => {
    return await workoutService.getWorkoutHistory(ctx.db, {
      userId: ctx.auth.userId,
      limit: 3,
    })
  }),

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
})
