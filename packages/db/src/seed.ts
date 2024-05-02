import { promises as fs } from "fs";
import path from "path";
import slugify from "slugify";

import type {
  MeasurementType,
  MuscleCategory,
  MuscleGroupNames,
} from "./schema/schema";
import { db } from ".";
import { _muscleGroupsData } from "./schema/schema";
import * as schema from "./schema/schema";

const muscleGroupsData = validateIdUniqueness(
  _muscleGroupsData.map((mg) => ({
    name: mg,
    id: `mg:${getSlug(mg)}`,
  })),
);

let _exercisesData: {
  name: string;
  primaryMuscleGroupId: MuscleGroupNames;
  secondaryMuscleGroupIds: MuscleGroupNames[];
  description: string;
  commonPitfalls: string;
  measurementType: MeasurementType;
  category: MuscleCategory;
}[];

type ExerciseJSON = {
  name: string;
  primary_muscle_group: MuscleGroupNames;
  secondary_muscle_groups: MuscleGroupNames[];
  description: string;
  common_pitfalls: string;
  measurement_type: MeasurementType;
  category: MuscleCategory;
};

const main = async () => {
  const jsonPath = path.resolve("./src/exercises.json");
  const fileData = await fs.readFile(jsonPath, "utf8");
  const jsonExercises =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    JSON.parse(fileData).exercises as ExerciseJSON[];

  _exercisesData = jsonExercises.map((exercise) => ({
    name: exercise.name,
    primaryMuscleGroupId: exercise.primary_muscle_group,
    secondaryMuscleGroupIds: exercise.secondary_muscle_groups,
    description: exercise.description,
    commonPitfalls: exercise.common_pitfalls,
    measurementType: exercise.measurement_type,
    category: exercise.category,
  }));

  const exercisesData = validateIdUniqueness(
    _exercisesData.map((data) => ({
      ...data,
      id: `ex:${getSlug(data.name)}`,
    })),
  );

  const muscleGroupInserts = requireAtLeastOne(
    muscleGroupsData.map((mg) =>
      db
        .insert(schema.muscleGroups)
        .values(mg)
        .onConflictDoUpdate({
          target: schema.muscleGroups.id,
          set: mg,
        })
        .returning({
          id: schema.muscleGroups.id,
          name: schema.muscleGroups.name,
        }),
    ),
  );

  const muscleGroupIds = (await db.batch(muscleGroupInserts)).flat();

  const muscleGroupsIdMap = muscleGroupIds.reduce(
    (acc, mg) => {
      acc[mg.name as MuscleGroupNames] = mg.id;
      return acc;
    },
    {} as Record<MuscleGroupNames, string>,
  );

  const exercisesToEnter = exercisesData.map(
    ({ secondaryMuscleGroupIds: _, ...e }) => ({
      ...e,
      primaryMuscleGroupId: muscleGroupsIdMap[e.primaryMuscleGroupId],
      thumbnailUrl: "",
      gifUrl: "",
    }),
  );

  const exerciseInserts = requireAtLeastOne(
    exercisesToEnter.map((e) =>
      db
        .insert(schema.exercises)
        .values(e)
        .onConflictDoUpdate({
          target: schema.exercises.id,
          set: e,
        })
        .returning({
          id: schema.exercises.id,
        }),
    ),
  );
  const insertedExercisesIds = (await db.batch(exerciseInserts)).flat();

  const secondaryMuscleGroupsToInsert = requireAtLeastOne(
    exercisesData.flatMap((exercise, index) => {
      return exercise.secondaryMuscleGroupIds.map((muscleGroupName) => {
        const muscleGroupId = muscleGroupsIdMap[muscleGroupName];
        if (!muscleGroupId) {
          throw new Error(`Muscle group ID not found for ${muscleGroupName}`);
        }
        return db.insert(schema.exercisesToSecondaryMuscleGroups).values({
          exerciseId: insertedExercisesIds[index]?.id ?? "",
          muscleGroupId: muscleGroupId,
        });
      });
    }),
  );

  await db.batch(secondaryMuscleGroupsToInsert);

  console.log("Database seeding completed.");
};

main().catch(console.error);

function validateIdUniqueness<Item extends { id: string }>(data: Item[]) {
  const ids = new Map<string, number>();
  data.forEach((d, i) => {
    if (ids.has(d.id)) {
      throw new Error(
        `Duplicate ID found: ${d.id} at indexes ${ids.get(d.id)} and ${i}`,
      );
    }
    ids.set(d.id, i);
  });

  return data;
}

function getSlug(name: string) {
  return slugify(name, { lower: true });
}

function requireAtLeastOne<T>(arr: T[]): [T, ...T[]] {
  if (arr.length === 0) {
    throw new Error("Expected at least one item in array.");
  }
  return arr as [T, ...T[]];
}
