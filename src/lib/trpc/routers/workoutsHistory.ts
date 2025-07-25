import { workoutService } from "~/lib/services/workout-service"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { z } from "zod"
import { type DB } from "~/lib/db"

export const workoutsHistoryRouter = createTRPCRouter({
  infinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await getInfiniteWorkouts(ctx, {
        ...input,
        isTemplate: false,
      })
    }),

  infiniteTemplates: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(10).default(10),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await getInfiniteWorkouts(ctx, {
        ...input,
        isTemplate: true,
      })
    }),

  exercise: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        limit: z.number().min(1).max(50).default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await workoutService.getExerciseHistory(ctx.db, {
        exerciseId: input.exerciseId,
        userId: ctx.auth.userId,
        limit: input.limit,
      })
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
})

async function getInfiniteWorkouts(
  ctx: { db: DB; auth: { userId: string } },
  input: { isTemplate: boolean; limit: number; cursor?: string },
) {
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
}
