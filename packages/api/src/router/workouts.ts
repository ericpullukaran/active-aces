import { z } from "zod";
import { Context } from "../context";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

const getCurrentWorkout = async (ctx: Context) => {
  if (!ctx.user) return null;

  return ctx.prisma.workout.findFirst({
    where: {
      userId: ctx.user.id,
    },
  });
};

const setDetailsUnion = z.union([
  z.object({
    weight: z.number().positive().finite(),
    numReps: z.number().positive().int(),
  }),
  z.object({
    numReps: z.number().positive().int(),
  }),
  z.object({
    time: z.number().positive().int(),
  }),
  z.object({
    time: z.number().positive().int(),
    distance: z.number().positive(),
  }),
]);

export const workoutsRouter = router({
  history: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workout.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        startTime: "desc",
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

  start: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        templateId: z.string().optional(),
      }),
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
          name: input.name || "Untitled workout",
          userId: ctx.user.id,
        },
      });
    }),

  end: protectedProcedure
    .input(
      z.object({
        exercises: z.array(
          z.object({
            exerciseId: z.string(),
            notes: z.string().optional(),
            sets: z.array(setDetailsUnion),
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

        return e.sets.every((set) =>
          requiredFields.every((field) => field in set),
        );
      });

      if (!allSetsAreValid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more sets are invalid",
        });
      }

      await ctx.prisma.workout.update({
        where: {
          id: current.id,
        },
        data: {
          endTime: new Date().toISOString(),
          exercises: {
            createMany: {
              data: input.exercises.map((e, i) => ({
                order: i,
                exerciseId: e.exerciseId,
                notes: e.notes,
                sets: {
                  createMany: {
                    data: e.sets.map((set, i) => ({
                      ...set,
                      order: i,
                    })),
                  },
                },
              })),
            },
          },
        },
      });
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
