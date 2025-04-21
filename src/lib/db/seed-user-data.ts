import { db } from "./index";
import { exercises, workouts, workoutExercises, exerciseSets } from "./schema";

// Sample workout data
const sampleWorkouts = [
  {
    name: "Chest and Triceps",
    notes: "Focus on heavy compound movements",
    exercises: [
      {
        name: "Bench Press (Barbell)",
        order: 1,
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 175, reps: 6, completed: true },
          { weight: 185, reps: 4, completed: true },
        ],
      },
      {
        name: "Incline Bench Press (Dumbbell)",
        order: 2,
        sets: [
          { weight: 50, reps: 10, completed: true },
          { weight: 55, reps: 8, completed: true },
          { weight: 60, reps: 6, completed: true },
        ],
      },
      {
        name: "Tricep Pushdown",
        order: 3,
        sets: [
          { weight: 50, reps: 12, completed: true },
          { weight: 60, reps: 10, completed: true },
          { weight: 70, reps: 8, completed: true },
          { weight: 80, reps: 6, completed: true },
        ],
      },
    ],
  },
  {
    name: "Back and Biceps",
    notes: "Focus on form and mind-muscle connection",
    exercises: [
      {
        name: "Pull Ups",
        order: 1,
        sets: [
          { reps: 8, completed: true },
          { reps: 7, completed: true },
          { reps: 6, completed: true },
        ],
      },
      {
        name: "Lat Pulldown (Machine)",
        order: 2,
        sets: [
          { weight: 120, reps: 10, completed: true },
          { weight: 130, reps: 8, completed: true },
          { weight: 140, reps: 6, completed: true },
        ],
      },
      {
        name: "Bicep Curl (EZ Bar)",
        order: 3,
        sets: [
          { weight: 65, reps: 10, completed: true },
          { weight: 75, reps: 8, completed: true },
          { weight: 85, reps: 6, completed: true },
        ],
      },
      {
        name: "Hammer Curl",
        order: 4,
        sets: [
          { weight: 30, reps: 12, completed: true },
          { weight: 35, reps: 10, completed: true },
          { weight: 40, reps: 8, completed: true },
        ],
      },
    ],
  },
  {
    name: "Legs",
    notes: "Focus on depth and control",
    exercises: [
      {
        name: "Squat (Barbell)",
        order: 1,
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 185, reps: 6, completed: true },
          { weight: 205, reps: 4, completed: true },
        ],
      },
      {
        name: "Leg Press (Machine)",
        order: 2,
        sets: [
          { weight: 225, reps: 12, completed: true },
          { weight: 275, reps: 10, completed: true },
          { weight: 315, reps: 8, completed: true },
        ],
      },
      {
        name: "Leg Extension (Machine)",
        order: 3,
        sets: [
          { weight: 120, reps: 12, completed: true },
          { weight: 130, reps: 10, completed: true },
          { weight: 140, reps: 8, completed: true },
        ],
      },
      {
        name: "Seated Leg Curl (Machine)",
        order: 4,
        sets: [
          { weight: 100, reps: 12, completed: true },
          { weight: 110, reps: 10, completed: true },
          { weight: 120, reps: 8, completed: true },
        ],
      },
    ],
  },
  {
    name: "Shoulders and Arms",
    notes: "Focus on isolation and form",
    exercises: [
      {
        name: "Military Press",
        order: 1,
        sets: [
          { weight: 95, reps: 10, completed: true },
          { weight: 105, reps: 8, completed: true },
          { weight: 115, reps: 6, completed: true },
        ],
      },
      {
        name: "Lateral Raise (Dumbbell)",
        order: 2,
        sets: [
          { weight: 15, reps: 12, completed: true },
          { weight: 20, reps: 10, completed: true },
          { weight: 25, reps: 8, completed: true },
        ],
      },
      {
        name: "Face Pull",
        order: 3,
        sets: [
          { weight: 50, reps: 15, completed: true },
          { weight: 60, reps: 12, completed: true },
          { weight: 70, reps: 10, completed: true },
        ],
      },
      {
        name: "Cable Overhead Extension",
        order: 4,
        sets: [
          { weight: 60, reps: 12, completed: true },
          { weight: 70, reps: 10, completed: true },
          { weight: 80, reps: 8, completed: true },
        ],
      },
    ],
  },
];

/**
 * Seeds workout logs and exercises for a given user ID
 * @param userId The ID of the user to seed data for
 * @param numberOfWorkouts Number of workouts to create (default: 10)
 */
async function seedUserData(userId: string, numberOfWorkouts = 10) {
  console.log(`🌱 Starting user data seed process for user ${userId}...`);

  try {
    // Get all exercises
    console.log("Fetching exercises...");
    const allExercises = await db.select().from(exercises);
    const exerciseMap = new Map(
      allExercises.map((exercise) => [exercise.name, exercise.id])
    );

    // Check if user exists
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    });

    if (!user) {
      console.error(`❌ User with ID ${userId} not found`);
      return;
    }

    console.log(`✅ Found user: ${user.name || userId}`);

    // Create workouts
    console.log(`Creating ${numberOfWorkouts} workouts...`);

    // Generate dates for workouts (spread over the last 30 days)
    const workoutDates = Array.from({ length: numberOfWorkouts }, (_, i) => {
      // Spread workouts over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);

      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      date.setMinutes(date.getMinutes() - minutesAgo);

      return date;
    }).sort((a, b) => a.getTime() - b.getTime());

    for (let i = 0; i < numberOfWorkouts; i++) {
      // Select a random workout template
      const workoutTemplate =
        sampleWorkouts[Math.floor(Math.random() * sampleWorkouts.length)];

      // Create workout
      const startTime = workoutDates[i];
      const endTime = new Date(startTime);
      endTime.setMinutes(
        endTime.getMinutes() + 60 + Math.floor(Math.random() * 30)
      ); // 60-90 minutes

      const [workout] = await db
        .insert(workouts)
        .values({
          userId,
          name: workoutTemplate.name,
          startTime,
          endTime,
          notes: workoutTemplate.notes,
        })
        .returning();

      console.log(
        `✅ Created workout: ${
          workout.name
        } (${startTime.toLocaleDateString()})`
      );

      // Create workout exercises
      for (const exerciseTemplate of workoutTemplate.exercises) {
        const exerciseId = exerciseMap.get(exerciseTemplate.name);

        if (!exerciseId) {
          console.warn(`⚠️ Exercise not found: ${exerciseTemplate.name}`);
          continue;
        }

        const [workoutExercise] = await db
          .insert(workoutExercises)
          .values({
            workoutId: workout.id,
            exerciseId,
            order: exerciseTemplate.order,
          })
          .returning();

        // Create exercise sets
        for (let j = 0; j < exerciseTemplate.sets.length; j++) {
          const setTemplate = exerciseTemplate.sets[j];
          const setStartTime = new Date(startTime);
          setStartTime.setMinutes(setStartTime.getMinutes() + j * 2 + 5); // 5 minutes after workout start, 2 minutes between sets

          // Check if weight exists in the set template
          const weight = "weight" in setTemplate ? setTemplate.weight : null;

          await db.insert(exerciseSets).values({
            workoutExerciseId: workoutExercise.id,
            order: j + 1,
            weight: weight,
            reps: setTemplate.reps,
            completed: setTemplate.completed,
            completedAt: setTemplate.completed ? setStartTime : null,
          });
        }
      }
    }

    console.log(
      `✅ Successfully created ${numberOfWorkouts} workouts for user ${userId}`
    );
  } catch (error) {
    console.error("❌ Error during user data seed:", error);
    throw error;
  }
}

// Command-line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error(
      "Usage: ts-node seed-user-data.ts <userId> [numberOfWorkouts]"
    );
    process.exit(1);
  }

  const userId = args[0];
  const numberOfWorkouts = args.length > 1 ? parseInt(args[1], 10) : 10;

  if (isNaN(numberOfWorkouts)) {
    console.error("Number of workouts must be a valid number");
    process.exit(1);
  }

  console.log(`Seeding ${numberOfWorkouts} workouts for user ${userId}...`);

  seedUserData(userId, numberOfWorkouts)
    .catch((error) => {
      console.error("Failed to seed user data:", error);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
}

export { seedUserData };
