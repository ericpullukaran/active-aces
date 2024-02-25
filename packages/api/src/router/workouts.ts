import { z } from "zod";
import { Context } from "../context";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type Prisma } from "@acme/db";

const getCurrentWorkout = async (ctx: Context) => {
  if (!ctx.user) return null;

  return ctx.prisma.workout.findFirst({
    where: {
      userId: ctx.user.id,
      endTime: null,
    },
  });
};

const setDetailsUnion = z.union([
  /**
   * ! NOTE: ORDER MATTERS HERE
   * ! Zod will match on the first schema that matches
   */
  z.object({
    weight: z.number().positive().finite(),
    numReps: z.number().positive().int(),
  }),
  z.object({
    numReps: z.number().positive().int(),
  }),
  z.object({
    time: z.number().positive().int(),
    distance: z.number().positive(),
  }),
  z.object({
    time: z.number().positive().int(),
  }),
]);

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
  startTime: z.date(),
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
      const workout = await ctx.prisma.workout.findFirst({
        where: {
          userId: ctx.user.id,
          exercises: {
            some: {
              exerciseId: input.exerciseId,
            },
          },
        },
        orderBy: {
          startTime: "desc",
        },
        take: 1, // Only take the most recent workout
        include: {
          exercises: {
            orderBy: {
              order: "asc",
            },
            include: {
              sets: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });

      return {
        workout,
      };
    }),

  history: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z
          .number()
          .refine((n) => Math.max(Math.min(n, 20), 1))
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;

      const workouts = await ctx.prisma.workout.findMany({
        where: {
          userId: ctx.user.id,
        },
        orderBy: {
          startTime: "desc",
        },
        cursor: input.cursor
          ? {
              id: input?.cursor,
            }
          : undefined,
        take: limit + 1,
        include: {
          exercises: {
            orderBy: {
              order: "asc",
            },
            include: {
              sets: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;

      if (workouts.length > limit) {
        const nextItem = workouts.pop();
        nextCursor = nextItem!.id;
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
      return ctx.prisma.workout.findFirst({
        where: {
          userId: ctx.user.id,
          id: input.id,
        },
        include: {
          exercises: {
            orderBy: {
              order: "asc",
            },
            include: {
              sets: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });
    }),

  current: protectedProcedure.query(async ({ ctx }) => {
    return getCurrentWorkout(ctx);
  }),

  put: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        workout: PutWorkoutSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(async (db) => {
        if (input.id) {
          const workoutExercises = await db.workoutExercise.findMany({
            where: {
              workoutId: input.id,
            },
          });

          await Promise.all([
            db.workoutExerciseSet.deleteMany({
              where: {
                workoutExerciseId: {
                  in: workoutExercises.map((e) => e.id),
                },
              },
            }),
            db.workoutExercise.deleteMany({
              where: {
                workoutId: input.id,
              },
            }),
          ]);
        }

        const workoutData = {
          name: input.workout.name,
          userId: ctx.user.id,
          startTime: input.workout.startTime,
          endTime: input.workout.endTime,
          notes: input.workout.notes,
          templateId: input.workout.templateId,
          exercises: {
            create: input.workout.exercises.map((e, i) => ({
              order: i,
              exercise: { connect: { id: e.exerciseId } },
              notes: e.notes,
              sets: {
                create: e.sets.map((s, j) => ({
                  ...s,
                  order: j,
                  complete: s.complete || false,
                })),
              },
            })),
          },
        } satisfies Parameters<typeof db.workout.create>[0]["data"];

        if (!input.id) {
          await db.workout.create({
            data: workoutData,
          });
        } else {
          await db.workout.upsert({
            where: {
              id: input.id,
            },
            update: workoutData,
            create: workoutData,
          });
        }
      });
    }),

  start: protectedProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          templateId: z.string().optional(),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const current = await getCurrentWorkout(ctx);
      if (current) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot start a workout when another is already in progress",
        });
      }

      await ctx.prisma.workout.create({
        data: {
          name: input?.name || "Untitled workout",
          userId: ctx.user.id,
        },
      });
    }),

  end: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        exercises: z.array(
          z.object({
            tmpId: z.string(),
            exerciseId: z.string(),
            notes: z.string().optional(),
            sets: setArrayUnion,
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const current = await getCurrentWorkout(ctx);
      if (!current) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Cannot end a workout when none is in progress",
        });
      }

      const allExercises = await ctx.prisma.exercise.findMany({
        where: {
          id: {
            in: input.exercises.map((e) => e.exerciseId),
          },
        },
      });
      const allExercisesAsObject = Object.fromEntries(
        allExercises.map((e) => [e.id, e]),
      );
      const allInputExercisesAreValid = input.exercises.every(
        (e) => allExercisesAsObject[e.exerciseId],
      );

      if (!allInputExercisesAreValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more exercises are invalid",
        });
      }

      console.dir(input.exercises, { depth: Infinity });

      const allSetsAreValid = input.exercises.every((e) => {
        const exerciseDetails = allExercisesAsObject[e.exerciseId];
        if (!exerciseDetails) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Exercise ${e.exerciseId} not found after validating. We should never get here.`,
          });
        }

        const requiredFields =
          {
            "weight-reps": ["weight", "numReps"],
            reps: ["numReps"],
            "time-distance": ["time", "distance"],
            time: ["time"],
          }[exerciseDetails.measurementType] || [];

        console.log(requiredFields, e.sets);

        return (e.sets as Record<string, unknown>[]).every((set) =>
          requiredFields.every((field) => field in set),
        );
      });

      if (!allSetsAreValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more sets are invalid",
        });
      }

      const workoutUpdates: Prisma.workoutUpdateInput = {
        endTime: new Date().toISOString(),
      };

      if (input.name?.trim()) {
        workoutUpdates.name = input.name.trim();
      }

      await ctx.prisma.$transaction([
        // Start by updating the workout with its end time
        ctx.prisma.workout.update({
          where: {
            id: current.id,
          },
          data: workoutUpdates,
        }),
        // Then, create the exercises
        ctx.prisma.workoutExercise.createMany({
          data: input.exercises.map((e, i) => ({
            id: e.tmpId,
            order: i,
            exerciseId: e.exerciseId,
            notes: e.notes,
            workoutId: current.id, // assuming there's a workoutId field in Exercise model
          })),
        }),
        // Finally, create the sets for each exercise
        // This assumes that you have a way of associating sets with their respective exercises
        ctx.prisma.workoutExerciseSet.createMany({
          data: input.exercises.flatMap((exercise) =>
            (exercise.sets as any[]).map((set, idx) => ({
              ...set,
              complete: true,
              order: idx,
              // FIXME: very sketch,
              workoutExerciseId: exercise.tmpId,
            })),
          ),
        }),
      ]);
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workout not found",
        });
      }

      await ctx.prisma.workout.delete({
        where: {
          id: input.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        exerciseUpdates: z.array(
          z.object({
            id: z.string(),
            notes: z.string().optional(),
          }),
        ),
        setUpdates: z.array(
          z
            .object({
              id: z.string(),
            })
            .and(setDetailsUnion),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Need to validate separately since prisma's update doesn't allow us to filter by userId
      const existing = await ctx.prisma.workout.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workout not found",
        });
      }

      // await ctx.prisma.workout.update({
      //   where: {
      //     id: input.id,
      //   },
      //   data: input.updates,
      // });
    }),
});
