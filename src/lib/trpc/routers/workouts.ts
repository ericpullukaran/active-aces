import { workoutService } from "~/lib/services/workout-service"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from "zod"
import { PutWorkoutSchema } from "~/lib/types/workout"

export const workoutsRouter = createTRPCRouter({
  historyInfinite: protectedProcedure
    .input(
      z.object({
        isTemplate: z.boolean().default(false),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { isTemplate, limit, cursor } = input
      const items = await workoutService.getWorkoutHistoryWithExercises(ctx.db, {
        userId: ctx.auth.userId,
        isTemplate,
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

  getPreviousSetMetrics: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        // Number of sets to look up; Will return array of this length with nulls if they
        // haven't done it before.
        numberOfSets: z.number().min(1).max(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await workoutService.getPreviousSetMetrics(ctx.db, {
        exerciseId: input.exerciseId,
        numberOfSets: input.numberOfSets,
        userId: ctx.auth.userId,
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
