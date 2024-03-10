import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  getAuth: publicProcedure.query(({ ctx }) => {
    return ctx.auth;
  }),
});
