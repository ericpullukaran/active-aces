import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, createTRPCRouter as router } from "../trpc";

const setArrayUnion = z.union([
  z
    .object({
      weight: z.number().nonnegative().finite(),
      numReps: z.number().nonnegative().int(),
      complete: z.boolean().optional(),
    })
    .array(),

  z
    .object({
      numReps: z.number().nonnegative().int(),
      complete: z.boolean().optional(),
    })
    .array(),

  z
    .object({
      time: z.number().nonnegative().int(),
      distance: z.number().nonnegative(),
      complete: z.boolean().optional(),
    })
    .array(),

  z
    .object({
      time: z.number().nonnegative().int(),
      complete: z.boolean().optional(),
    })
    .array(),
]);

type SetArrayUnionType = z.infer<typeof setArrayUnion>;
export type EndWorkoutInput = {
  exercises: {
    sets: SetArrayUnionType;
    exerciseId: string;
    tmpId: string;
    notes?: string;
  }[];
};

const PutWorkoutSchema = z.object({
  name: z.string(),
  startTime: z
    .union([z.date(), z.string()])
    .transform((dateOrString) =>
      typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString,
    )
    .optional(),
  endTime: z.date().optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      notes: z.string().optional(),
      sets: z.array(
        z.object({
          weight: z.number().optional(),
          numReps: z.number().optional(),
          time: z.number().optional(),
          distance: z.number().optional(),
          complete: z.boolean().optional(),
        }),
      ),
    }),
  ),
  notes: z.string().optional(),

  templateId: z.string().optional(),
});

export const workoutsRouter = router({
  previousExercise: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const workoutExercises = ctx.db
        .select({
          workoutId: ctx.db.$schema.workoutExercises.workoutId,
        })
        .from(ctx.db.$schema.workoutExercises)
        .where(() =>
          ctx.db.$cmp.eq(
            ctx.db.$schema.workoutExercises.exerciseId,
            input.exerciseId,
          ),
        );

      const workout = await ctx.db.query.workouts.findFirst({
        where: (f, c) =>
          c.and(c.inArray(f.id, workoutExercises), c.isNotNull(f.endTime)),
        with: {
          exercises: {
            with: {
              sets: true,
            },
          },
        },
        orderBy: (f, o) => o.desc(f.endTime),
      });

      return {
        workout,
      };
    }),

  history: protectedProcedure
    .input(
      z.object({
        cursor: z.date().optional(),
        limit: z
          .number()
          .refine((n) => Math.max(Math.min(n, 20), 1))
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;

      const workouts = await ctx.db.query.workouts.findMany({
        where: (f, c) => {
          const userIdCmp = c.eq(f.userId, ctx.auth.userId);
          if (input.cursor) {
            return c.and(userIdCmp, c.lt(f.endTime, input.cursor));
          }
          return userIdCmp;
        },
        orderBy: (f, o) => o.desc(f.startTime),

        limit: limit + 1,
        with: {
          exercises: {
            with: {
              sets: {},
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (workouts.length > limit) {
        const nextItem = workouts.pop();
        nextCursor = nextItem?.endTime ?? undefined;
      }

      return {
        workouts,
        nextCursor,
      };
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.workouts.findFirst({
        where: (f, c) =>
          c.and(c.eq(f.userId, ctx.auth.userId), c.eq(f.id, input.id)),
        with: {
          exercises: {
            orderBy: (f, o) => o.asc(f.order),
            with: {
              sets: {
                orderBy: (f, o) => o.asc(f.order),
              },
            },
          },
        },
      });
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const inprogress = await ctx.db
      .select()
      .from(ctx.db.$schema.workouts)
      .where(
        ctx.db.$cmp.and(
          ctx.db.$cmp.eq(ctx.db.$schema.workouts.userId, ctx.auth.userId),
          ctx.db.$cmp.isNull(ctx.db.$schema.workouts.endTime),
        ),
      )
      .limit(1);

    return inprogress[0];
  }),

  put: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        workout: PutWorkoutSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        if (input.id) {
          const workoutExercises = await db.query.workoutExercises.findMany({
            where: (f, c) => c.eq(f.workoutId, input.id!),
          });

          if (workoutExercises.length > 0) {
            await Promise.all([
              db.delete(ctx.db.$schema.workoutExerciseSets).where(
                ctx.db.$cmp.inArray(
                  ctx.db.$schema.workoutExerciseSets.workoutExerciseId,
                  workoutExercises.map((e) => e.id),
                ),
              ),
              db
                .delete(ctx.db.$schema.workoutExercises)
                .where(
                  ctx.db.$cmp.eq(
                    ctx.db.$schema.workoutExercises.workoutId,
                    input.id,
                  ),
                ),
            ]);
          }
        }

        const workoutData = {
          name: input.workout.name,
          userId: ctx.auth.userId,
          startTime: input.workout.startTime,
          endTime: input.workout.endTime,
          notes: input.workout.notes,
          templateId: input.workout.templateId,
        };

        let workoutIdToUse: string;

        if (!input.id) {
          const inserted = await db
            .insert(ctx.db.$schema.workouts)
            .values(workoutData)
            .returning({
              id: ctx.db.$schema.workouts.id,
            });

          if (inserted?.[0]?.id) {
            workoutIdToUse = inserted[0].id;
          }
        } else {
          // Update existing workout in db
          const _ = await db
            .update(ctx.db.$schema.workouts)
            .set(workoutData)
            .where(ctx.db.$cmp.eq(ctx.db.$schema.workouts.id, input.id))
            .returning({ id: ctx.db.$schema.workouts.id });

          workoutIdToUse = input.id;
        }

        if (input.workout.exercises.length > 0) {
          const insertedExercises = await db
            .insert(ctx.db.$schema.workoutExercises)
            .values(
              input.workout.exercises.map((e, i) => ({
                order: i,
                exerciseId: e.exerciseId,
                workoutId: workoutIdToUse,
                notes: e.notes,
              })),
            )
            .returning();
          const insertedExercisesByOrder = Object.fromEntries(
            insertedExercises.map((e) => [e.order, e] as const),
          );

          await db.insert(ctx.db.$schema.workoutExerciseSets).values(
            input.workout.exercises.flatMap((e, i) =>
              e.sets.map((s, j) => ({
                ...s,
                order: j,
                complete: s.complete ?? false,
                workoutExerciseId: insertedExercisesByOrder[i]?.id,
              })),
            ),
          );
        }
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.workouts.findFirst({
        where: (f, c) =>
          c.and(c.eq(f.id, input.id), c.eq(f.userId, ctx.auth.userId)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workout not found",
        });
      }

      await ctx.db.transaction(async (db) => {
        const [deletedWorkout] = await db
          .delete(ctx.db.$schema.workouts)
          .where(
            ctx.db.$cmp.and(
              ctx.db.$cmp.eq(ctx.db.$schema.workouts.id, input.id),
              ctx.db.$cmp.eq(ctx.db.$schema.workouts.userId, ctx.auth.userId),
            ),
          )
          .returning({
            id: ctx.db.$schema.workouts.id,
          });

        if (!deletedWorkout) return;

        const deletedExercises = await db
          .delete(ctx.db.$schema.workoutExercises)
          .where(
            ctx.db.$cmp.eq(
              ctx.db.$schema.workoutExercises.workoutId,
              deletedWorkout.id,
            ),
          )
          .returning({
            id: ctx.db.$schema.workoutExercises.id,
          });

        await db.delete(ctx.db.$schema.workoutExerciseSets).where(
          ctx.db.$cmp.inArray(
            ctx.db.$schema.workoutExerciseSets.workoutExerciseId,
            deletedExercises.map((e) => e.id),
          ),
        );
      });
    }),
});
