import { db } from ".";
import * as schema from "./schema/schema";

type MeasurementType = "weight-reps" | "reps" | "time-distance" | "time";
const muscleGroupsData = [
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

type MuscleGroupNames = (typeof muscleGroupsData)[number];

const exercisesData: {
  name: string;
  primaryMuscleGroupId: MuscleGroupNames;
  description: string;
  commonPitfalls: string;
  measurementType: MeasurementType;
}[] = [
  {
    name: "Bench Press",
    primaryMuscleGroupId: "chest",
    description:
      "A compound exercise that targets the chest muscles by pressing a weight upwards from a supine position.",
    commonPitfalls:
      "Not keeping the feet flat on the ground, arching the back excessively, flaring the elbows.",
    measurementType: "weight-reps",
  },
  {
    name: "Squats",
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
    name: "Pull-ups",
    primaryMuscleGroupId: "lats",
    description:
      "An upper-body strength exercise that targets the lats by pulling the body up while hanging from a bar.",
    commonPitfalls:
      "Using momentum instead of muscle strength, not fully extending the arms on the way down.",
    measurementType: "reps",
  },
  {
    name: "Shoulder Press",
    primaryMuscleGroupId: "shoulders",
    description:
      "A weight training exercise in which a weight is pressed from the shoulders until the arms are extended overhead.",
    commonPitfalls:
      "Arching the back, not using full range of motion, locking the elbows at the top.",
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
    name: "Bicep Curls",
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
    measurementType: "reps",
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
];

const main = async () => {
  const muscleGroupIds = await db
    .insert(schema.muscleGroups)
    .values(muscleGroupsData.map((mg) => ({ name: mg })))
    .returning({
      id: schema.muscleGroups.id,
      name: schema.muscleGroups.name,
    });

  const muscleGroupsIdMap = muscleGroupIds.reduce(
    (acc, mg) => {
      acc[mg.name as MuscleGroupNames] = mg.id;
      return acc;
    },
    {} as Record<MuscleGroupNames, string>,
  );

  const exercisesToEnter = exercisesData.map((e) => ({
    name: e.name,
    primaryMuscleGroupId: muscleGroupsIdMap[e.primaryMuscleGroupId],
    description: e.description,
    commonPitfalls: e.commonPitfalls,
    thumbnailUrl: "",
    gifUrl: "",
    measurementType: e.measurementType,
  }));

  await db.insert(schema.exercises).values(exercisesToEnter).execute();
  console.log("Database seeding completed.");
};

main().catch(console.error);
