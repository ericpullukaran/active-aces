import { createTRPCRouter, protectedProcedure } from "../trpc"
import { exercisesService } from "~/lib/services/exercises-service"

export const exercisesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await exercisesService.getAllExercises(ctx.db)
  }),
})
