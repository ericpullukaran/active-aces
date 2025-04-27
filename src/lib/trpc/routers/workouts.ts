import { workoutService } from "~/lib/services/workout-service"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from "zod"
import { PutWorkoutSchema } from "~/lib/types/workout"

export const workoutsRouter = createTRPCRouter({
  historyInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input
      const items = await workoutService.getWorkoutHistoryWithExercises(ctx.db, {
        userId: ctx.auth.userId,
        limit: limit + 1,
        cursor,
      })

      let nextCursor: string | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }

      return {
        items,
        nextCursor,
      }
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
