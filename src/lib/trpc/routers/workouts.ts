import { desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workoutsRouter = createTRPCRouter({
  history: protectedProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.db.query.workouts.findMany({
      where: ctx.db.$cmp.eq(ctx.db.$schema.workouts.userId, ctx.auth.userId),
      orderBy: [desc(ctx.db.$schema.workouts.createdAt)],
      limit: 3,
    });
    return workouts;
  }),
});
