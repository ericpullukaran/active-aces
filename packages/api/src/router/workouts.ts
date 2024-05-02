import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { MuscleCategory } from "../../../db/src/schema/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
      collapsed: z.boolean().default(false),
      exerciseId: z.string(),
      notes: z.string().optional(),
      sets: z.array(
        z.object({
          tmpId: z.number(),
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

export const workoutsRouter = createTRPCRouter({
  getExerciseSetHistory: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        setOrder: z.number().nonnegative(),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { exerciseId, setOrder, limit } = input;

      const records = await ctx.db
        .select({
          setDetails: ctx.db.$schema.workoutExerciseSets,
          workoutDate: ctx.db.$schema.workouts.endTime,
        })
        .from(ctx.db.$schema.workoutExerciseSets)
        .innerJoin(
          ctx.db.$schema.workoutExercises,
          ctx.db.$cmp.eq(
            ctx.db.$schema.workoutExerciseSets.workoutExerciseId,
            ctx.db.$schema.workoutExercises.id,
          ),
        )
        .innerJoin(
          ctx.db.$schema.workouts,
          ctx.db.$cmp.eq(
            ctx.db.$schema.workoutExercises.workoutId,
            ctx.db.$schema.workouts.id,
          ),
        )
        .where(
          ctx.db.$cmp.and(
            ctx.db.$cmp.eq(
              ctx.db.$schema.workoutExercises.exerciseId,
              exerciseId,
            ),
            ctx.db.$cmp.eq(ctx.db.$schema.workouts.userId, ctx.auth.userId),
            ctx.db.$cmp.eq(ctx.db.$schema.workoutExerciseSets.order, setOrder),
            ctx.db.$cmp.eq(ctx.db.$schema.workoutExerciseSets.complete, true),
          ),
        )
        .orderBy(ctx.db.$order.asc(ctx.db.$schema.workouts.endTime))
        .limit(limit)
        .execute();

      return records.map((record) => ({
        weight: record.setDetails.weight ?? undefined,
        numReps: record.setDetails.numReps ?? undefined,
        time: record.setDetails.time ?? undefined,
        distance: record.setDetails.distance ?? undefined,
        complete: record.setDetails.complete ?? undefined,
        workoutDate: record.workoutDate,
      }));
    }),

  getPreviousSet: protectedProcedure
    .input(
      z.object({
        exerciseId: z.string(),
        setOrder: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { exerciseId, setOrder } = input;

      const result = await ctx.db
        .select({
          weight: ctx.db.$schema.workoutExerciseSets.weight,
          numReps: ctx.db.$schema.workoutExerciseSets.numReps,
          time: ctx.db.$schema.workoutExerciseSets.time,
          distance: ctx.db.$schema.workoutExerciseSets.distance,
          complete: ctx.db.$schema.workoutExerciseSets.complete,
        })
        .from(ctx.db.$schema.workoutExerciseSets)
        .innerJoin(
          ctx.db.$schema.workoutExercises,
          ctx.db.$cmp.eq(
            ctx.db.$schema.workoutExerciseSets.workoutExerciseId,
            ctx.db.$schema.workoutExercises.id,
          ),
        )
        .innerJoin(
          ctx.db.$schema.workouts,
          ctx.db.$cmp.eq(
            ctx.db.$schema.workoutExercises.workoutId,
            ctx.db.$schema.workouts.id,
          ),
        )
        .where(
          ctx.db.$cmp.and(
            ctx.db.$cmp.eq(
              ctx.db.$schema.workoutExercises.exerciseId,
              exerciseId,
            ),
            ctx.db.$cmp.eq(ctx.db.$schema.workouts.userId, ctx.auth.userId),
            ctx.db.$cmp.eq(ctx.db.$schema.workoutExerciseSets.order, setOrder),
          ),
        )
        .orderBy(ctx.db.$order.desc(ctx.db.$schema.workouts.endTime))
        .limit(1)
        .execute();

      return result[0]
        ? {
            weight: result[0].weight ?? undefined,
            numReps: result[0].numReps ?? undefined,
            time: result[0].time ?? undefined,
            distance: result[0].distance ?? undefined,
            complete: result[0].complete ?? undefined,
          }
        : undefined;
    }),

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
          .optional()
          .default(20),
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
              exercise: {
                columns: {
                  category: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (workouts.length > limit) {
        const nextItem = workouts.pop();
        nextCursor = nextItem?.endTime ?? undefined;
      }

      const workoutsToReturn = workouts.map((w) => {
        const categorySet = new Set<MuscleCategory>();
        w.exercises.forEach((e) => categorySet.add(e.exercise.category));
        return {
          ...w,
          exercises: w.exercises.map(({ exercise: _, ...e }) => ({ ...e })),
          categorySet: Array.from(categorySet),
        };
      });

      return {
        workouts: workoutsToReturn,
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
              e.sets.map(({ tmpId: _, ...s }, j) => ({
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

        if (deletedExercises.length) {
          await db.delete(ctx.db.$schema.workoutExerciseSets).where(
            ctx.db.$cmp.inArray(
              ctx.db.$schema.workoutExerciseSets.workoutExerciseId,
              deletedExercises.map((e) => e.id),
            ),
          );
        }
      });
    }),
});
