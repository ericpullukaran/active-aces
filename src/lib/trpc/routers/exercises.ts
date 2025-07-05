import { createTRPCRouter, protectedProcedure } from "../trpc"
import { exercisesService } from "~/lib/services/exercises-service"
import { z } from "zod"
import { MeasurementType } from "~/lib/db/types"

// Define measurement type enum based on schema
const MeasurementTypeEnum = z.enum([
  MeasurementType.WEIGHT_REPS,
  MeasurementType.TIME_DISTANCE,
  MeasurementType.WEIGHT_DURATION,
  MeasurementType.WEIGHT_DISTANCE,
  MeasurementType.TIME,
  MeasurementType.REPS,
])

// Schema for creating a new exercise
const CreateExerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  measurementType: MeasurementTypeEnum,
  primaryMuscleGroupId: z.string().optional(),
})

export const exercisesRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await exercisesService.getAllExercises(ctx.db, ctx.auth.userId)
  }),

  allMuscleGroups: protectedProcedure.query(async ({ ctx }) => {
    return await exercisesService.getAllMuscleGroups(ctx.db)
  }),

  create: protectedProcedure.input(CreateExerciseSchema).mutation(async ({ ctx, input }) => {
    return await exercisesService.createExercise(ctx.db, {
      ...input,
      creatorId: ctx.auth.userId,
    })
  }),

  delete: protectedProcedure
    .input(z.object({ exerciseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await exercisesService.deleteExercise(ctx.db, ctx.auth.userId, input.exerciseId)
    }),
})
