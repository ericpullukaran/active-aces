import { router, publicProcedure } from "../trpc";

export const exerciesRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.exercises.findMany();
  }),
});
