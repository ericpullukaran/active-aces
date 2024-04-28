import slugify from "slugify";

import { db } from ".";
import * as schema from "./schema/schema";

type MeasurementType = "weight-reps" | "reps" | "time-distance" | "time";
const _muscleGroupsData = [
  "abdominals",
  "abductors",
  "adductors",
  "biceps",
  "calves",
  "chest",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "lower back",
  "middle back",
  "neck",
  "quadriceps",
  "shoulders",
  "traps",
  "triceps",
] as const;
const muscleGroupsData = validateIdUniqueness(
  _muscleGroupsData.map((mg) => ({
    name: mg,
    id: `mg:${getSlug(mg)}`,
  })),
);

type MuscleGroupNames = (typeof _muscleGroupsData)[number];

const _exercisesData: {
  name: string;
  primaryMuscleGroupId: MuscleGroupNames;
  description: string;
  commonPitfalls: string;
  measurementType: MeasurementType;
}[] = [
  {
    name: "Squats (barbell)",
    primaryMuscleGroupId: "quadriceps",
    description:
      "A lower body exercise that targets the quadriceps, glutes, and hamstrings by bending the knees and lowering the body.",
    commonPitfalls:
      "Not keeping the knees in line with the toes, not going low enough, rounding the back.",
    measurementType: "weight-reps",
  },
  {
    name: "Deadlift",
    primaryMuscleGroupId: "lower back",
    description:
      "A weight lifting exercise where one lifts a loaded barbell or bar from the ground to the level of the hips, then back down.",
    commonPitfalls:
      "Rounding the back, not fully extending the hips, lifting with the arms instead of the legs.",
    measurementType: "weight-reps",
  },
  {
    name: "Leg Press",
    primaryMuscleGroupId: "quadriceps",
    description:
      "A compound weight training exercise in which the individual pushes a weight or resistance away from them using their legs.",
    commonPitfalls:
      "Placing the feet too high or too low on the plate, locking the knees at the top of the movement.",
    measurementType: "weight-reps",
  },
  {
    name: "Bicep Curl (Barbell)",
    primaryMuscleGroupId: "biceps",
    description:
      "An upper-body exercise that targets the biceps through the curling motion of lifting a weight towards the shoulders.",
    commonPitfalls:
      "Swinging the weights, not using full range of motion, lifting too heavy causing form breakdown.",
    measurementType: "weight-reps",
  },
  {
    name: "Tricep Dips",
    primaryMuscleGroupId: "triceps",
    description:
      "A body weight exercise that targets the triceps by using the arms to lower and raise the body.",
    commonPitfalls:
      "Not going low enough, flaring the elbows out, locking the elbows at the top.",
    measurementType: "weight-reps",
  },
  {
    name: "Plank",
    primaryMuscleGroupId: "abdominals",
    description:
      "A core strength exercise that involves maintaining a position similar to a push-up for the maximum possible time.",
    commonPitfalls: "Sagging the hips, arching the back, holding the breath.",
    measurementType: "time",
  },
  {
    name: "Russian Twists",
    primaryMuscleGroupId: "abdominals",
    description:
      "An exercise that targets the abs and obliques by twisting the torso while holding a weight.",
    commonPitfalls:
      "Not twisting fully, lifting the feet off the ground, rounding the back.",
    measurementType: "reps",
  },
  {
    name: "Lunges",
    primaryMuscleGroupId: "hamstrings",
    description:
      "A single-leg bodyweight exercise that works the hips, glutes, quads, hamstrings, core, and the hard-to-reach muscles of the inner thigh.",
    commonPitfalls:
      "Allowing the knee to extend past the toe, not keeping the back straight, taking too small a step.",
    measurementType: "reps",
  },
  {
    name: "Mountain Climbers",
    primaryMuscleGroupId: "abdominals",
    description:
      "A cardio exercise that also targets the core, involving a repetitive motion of driving the knees towards the chest.",
    commonPitfalls:
      "Not keeping the back straight, hips sagging or piking up, moving the hands instead of the feet.",
    measurementType: "time",
  },
  {
    name: "Calf Raises",
    primaryMuscleGroupId: "calves",
    description:
      "An exercise aimed at strengthening the calf muscles by repeatedly raising the heels off the ground.",
    commonPitfalls:
      "Not lifting the heels high enough, not maintaining balance, rushing the movements.",
    measurementType: "reps",
  },
  {
    name: "Lat Pulldowns",
    primaryMuscleGroupId: "lats",
    description:
      "A strength exercise that targets the latissimus dorsi muscles by pulling a weighted bar down in front of the body.",
    commonPitfalls:
      "Pulling the bar behind the neck, not fully extending the arms, using too much weight leading to poor form.",
    measurementType: "weight-reps",
  },
  {
    name: "Box Jumps",
    primaryMuscleGroupId: "glutes",
    description:
      "A plyometric exercise where the individual jumps onto and off of a box or platform to improve leg power and explosiveness.",
    commonPitfalls:
      "Not landing softly, jumping on a too high platform initially, not using the arms to aid in the jump.",
    measurementType: "reps",
  },
  {
    name: "Squat (Smith Machine)",
    primaryMuscleGroupId: "quadriceps",
    description:
      "A squat variation using the Smith Machine to guide the movement, providing stability and support.",
    commonPitfalls:
      "Failing to go low enough, placing feet too far forward, not keeping the back straight.",
    measurementType: "weight-reps",
  },
  {
    name: "Leg Curl",
    primaryMuscleGroupId: "hamstrings",
    description:
      "Targets the hamstrings by curling the legs towards the buttocks, typically performed on a leg curl machine.",
    commonPitfalls:
      "Using too much weight leading to poor form, not fully extending the legs.",
    measurementType: "weight-reps",
  },
  {
    name: "Calf Raise (Smith Machine)",
    primaryMuscleGroupId: "calves",
    description:
      "Strengthens the calf muscles by raising the heels off the ground under the resistance of a Smith Machine.",
    commonPitfalls:
      "Not raising the heels high enough, not maintaining a controlled movement.",
    measurementType: "weight-reps",
  },
  {
    name: "Shoulder Press (Dumbbell)",
    primaryMuscleGroupId: "shoulders",
    description:
      "Performed with dumbbells, this exercise targets the shoulder muscles through an overhead press motion.",
    commonPitfalls:
      "Not pressing the weights fully overhead, arching the back excessively.",
    measurementType: "weight-reps",
  },
  {
    name: "Front Raise (Dumbbell)",
    primaryMuscleGroupId: "shoulders",
    description:
      "Isolates the anterior deltoids by lifting the dumbbells in front of the body to shoulder height.",
    commonPitfalls:
      "Swinging the dumbbells, lifting beyond shoulder height, using excessive weight.",
    measurementType: "weight-reps",
  },
  {
    name: "Deadlift (Barbell)",
    primaryMuscleGroupId: "lower back",
    description:
      "Involves lifting a barbell off the ground to hip level and then lowering it back down, targeting the lower back, glutes, and hamstrings.",
    commonPitfalls:
      "Rounding the back, not fully extending the hips, using improper grip.",
    measurementType: "weight-reps",
  },
  {
    name: "Bent Over Row (Dumbbell)",
    primaryMuscleGroupId: "middle back",
    description:
      "Targets the middle back muscles by rowing dumbbells while in a bent-over position.",
    commonPitfalls:
      "Rounding the back, not bringing the weights all the way to the torso, using momentum.",
    measurementType: "weight-reps",
  },
  {
    name: "Bicep Curl (Dumbbell)",
    primaryMuscleGroupId: "biceps",
    description:
      "Targets the biceps by curling dumbbells towards the shoulders in a controlled motion.",
    commonPitfalls:
      "Swinging the dumbbells, not using full range of motion, curling wrists at the top.",
    measurementType: "weight-reps",
  },
  {
    name: "Cross Body Hammer Curl (Dumbbell)",
    primaryMuscleGroupId: "biceps",
    description:
      "A variation of the hammer curl where dumbbells are curled across the body, targeting the biceps and forearms.",
    commonPitfalls:
      "Not maintaining control of the dumbbells, moving the elbows during the curl.",
    measurementType: "weight-reps",
  },
  {
    name: "Palms Up Wrist Curl (Dumbbell)",
    primaryMuscleGroupId: "forearms",
    description:
      "Strengthens the forearms by curling the wrists upwards while holding dumbbells.",
    commonPitfalls:
      "Using too much weight, causing wrists to hyperextend, not keeping the forearms stationary.",
    measurementType: "weight-reps",
  },
  {
    name: "Incline Bench Press (Dumbbell)",
    primaryMuscleGroupId: "chest",
    description:
      "Targets the upper chest by pressing dumbbells upwards from an incline bench.",
    commonPitfalls:
      "Not bringing the dumbbells down low enough, arching the back, using weights that are too heavy.",
    measurementType: "weight-reps",
  },
  {
    name: "Bench Press (Dumbbell)",
    primaryMuscleGroupId: "chest",
    description:
      "A chest exercise performed by pressing dumbbells up from a flat bench position.",
    commonPitfalls:
      "Not pressing the dumbbells straight up, allowing the dumbbells to drift, not using a full range of motion.",
    measurementType: "weight-reps",
  },
  {
    name: "Decline Bench Press (Dumbbell)",
    primaryMuscleGroupId: "chest",
    description:
      "Targets the lower chest by pressing dumbbells upwards from a decline bench.",
    commonPitfalls:
      "Dropping the dumbbells too low, causing strain on the shoulders, not using a controlled motion.",
    measurementType: "weight-reps",
  },
  {
    name: "Close Grip Bench Press (Dumbbell)",
    primaryMuscleGroupId: "triceps",
    description:
      "Strengthens the triceps by pressing dumbbells up from a bench with a closer grip.",
    commonPitfalls:
      "Not keeping the dumbbells close together, flaring the elbows, not fully extending the arms.",
    measurementType: "weight-reps",
  },
  {
    name: "Close Grip Bench Press (Barbell)",
    primaryMuscleGroupId: "triceps",
    description:
      "Strengthens the triceps by pressing dumbbells up from a bench with a closer grip.",
    commonPitfalls:
      "Not keeping the dumbbells close together, flaring the elbows, not fully extending the arms.",
    measurementType: "weight-reps",
  },
  {
    name: "Skullcrusher (Dumbbell)",
    primaryMuscleGroupId: "triceps",
    description:
      "Targets the triceps by extending the arms to lift dumbbells overhead while lying on a bench.",
    commonPitfalls:
      "Dropping the dumbbells too close to the head, not extending the arms fully, using excessive weight.",
    measurementType: "weight-reps",
  },
  {
    name: "Tricep Kickback (Dumbbell)",
    primaryMuscleGroupId: "triceps",
    description:
      "Targets the triceps by kicking dumbbells back while in a bent-over position.",
    commonPitfalls:
      "Not keeping the upper arm stationary, swinging the dumbbells, not fully extending the arm.",
    measurementType: "weight-reps",
  },
  {
    name: "Bench Press (Barbell)",
    primaryMuscleGroupId: "chest",
    description:
      "A fundamental chest exercise involving pressing a barbell upwards from a flat bench.",
    commonPitfalls:
      "Arching the back excessively, bouncing the bar off the chest, flaring the elbows.",
    measurementType: "weight-reps",
  },
  {
    name: "Shoulder Press (Barbell)",
    primaryMuscleGroupId: "shoulders",
    description:
      "Involves pressing a barbell overhead from the shoulders, targeting the deltoid muscles.",
    commonPitfalls:
      "Using excessive weight leading to poor form, not pressing the barbell in a straight line.",
    measurementType: "weight-reps",
  },
  {
    name: "Cable Flys (Low to High)",
    primaryMuscleGroupId: "chest",
    description:
      "Targets the upper chest by performing a fly motion with cables from a low to high trajectory.",
    commonPitfalls:
      "Not controlling the motion, using too much weight, not keeping a slight bend in the elbows.",
    measurementType: "weight-reps",
  },
  {
    name: "Cable Flys (High to Low)",
    primaryMuscleGroupId: "chest",
    description:
      "Targets the lower chest by performing a fly motion with cables from a high to low trajectory.",
    commonPitfalls:
      "Using too much weight, causing the form to break down, not focusing on the chest contraction.",
    measurementType: "weight-reps",
  },
  {
    name: "Pull-ups",
    primaryMuscleGroupId: "lats",
    description:
      "An advanced variation of pull-ups involving additional weight, increasing the challenge for the lats and upper body.",
    commonPitfalls:
      "Not fully extending the arms at the bottom, using momentum instead of controlled muscle movement.",
    measurementType: "weight-reps",
  },
  {
    name: "Single Arm Lat Pulldown",
    primaryMuscleGroupId: "lats",
    description:
      "A variation of the lat pulldown performed with one arm at a time, allowing for focused muscle engagement.",
    commonPitfalls:
      "Not maintaining a straight posture, pulling the handle too far back, using excessive weight.",
    measurementType: "weight-reps",
  },
  {
    name: "Chin Up",
    primaryMuscleGroupId: "biceps",
    description:
      "Strengthens the biceps and lats by pulling the body up with palms facing towards the face.",
    commonPitfalls:
      "Not pulling up high enough to bring the chin over the bar, kicking or swinging for momentum.",
    measurementType: "weight-reps",
  },
  {
    name: "Incline Bicep Curl",
    primaryMuscleGroupId: "biceps",
    description:
      "Targets the biceps through a curling motion while seated on an incline bench, providing a unique angle for muscle engagement.",
    commonPitfalls:
      "Swinging the dumbbells, not using full range of motion, not keeping the shoulders back.",
    measurementType: "weight-reps",
  },
];
const exercisesData = validateIdUniqueness(
  _exercisesData.map((data) => ({
    ...data,
    id: `ex:${getSlug(data.name)}`,
  })),
);

const main = async () => {
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

  const exercisesToEnter = exercisesData.map((e) => ({
    ...e,
    primaryMuscleGroupId: muscleGroupsIdMap[e.primaryMuscleGroupId],
    thumbnailUrl: "",
    gifUrl: "",
  }));

  const exerciseInserts = requireAtLeastOne(
    exercisesToEnter.map((e) =>
      db.insert(schema.exercises).values(e).onConflictDoUpdate({
        target: schema.exercises.id,
        set: e,
      }),
    ),
  );
  await db.batch(exerciseInserts);

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
