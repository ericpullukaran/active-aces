import { db, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const exercisesRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.exercises.findMany({
      orderBy: db.$order.asc(schema.exercises.name),
    });
  }),
  getAllMuscleGroups: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .selectDistinct({
        primaryMuscleGroup: ctx.db.$schema.exercises.primaryMuscleGroupId,
      })
      .from(ctx.db.$schema.exercises);
  }),
});
