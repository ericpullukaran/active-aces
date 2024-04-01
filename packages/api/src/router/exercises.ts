import { db, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exercisesRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.exercises.findMany({
      orderBy: db.$order.asc(schema.exercises.name),
      limit: 20,
    });
  }),
});
