/* eslint-disable no-console */
// For variations of the same exercise using different equipment, I'll put the equipment in parentheses at the end:
// Example: "Bench Press (Barbell)" instead of "Barbell Bench Press"
// For exercise positions/angles, I'll put them at the start:
// Example: "Incline Bench Press (Dumbbell)"
// For single-sided exercises, I'll start with "Single":
// Example: "Single Leg Extension"
// For machine exercises, I'll specify "(Machine)" if it's a dedicated machine:
// Example: "Leg Extension (Machine)"
// For cable exercises, I'll use "Cable" at the start:
// Example: "Cable Lateral Raise"
import { db } from "./index"
import { exercises, muscleGroups, exerciseMuscleGroups } from "./schema"
import { type MeasurementType } from "./types"
import exercisesData from "./exercises.json"
import muscleGroupsData from "./muscle_groups.json"

async function seed() {
  console.log("🌱 Starting seed process...")

  try {
    // First get existing muscle groups
    console.log("Checking existing muscle groups...")
    const existingMuscleGroups = await db.select().from(muscleGroups)
    const existingMuscleGroupNames = new Set(existingMuscleGroups.map((g) => g.name))

    // Filter out existing muscle groups
    const newMuscleGroups = muscleGroupsData.filter(
      (group) => !existingMuscleGroupNames.has(group.name),
    )

    if (newMuscleGroups.length > 0) {
      console.log(`Inserting ${newMuscleGroups.length} new muscle groups...`)
      const muscleGroupsInserts = newMuscleGroups.map((group) => ({
        name: group.name,
        description: group.description,
      }))

      await db.insert(muscleGroups).values(muscleGroupsInserts).onConflictDoNothing()
      console.log(`✅ Inserted ${newMuscleGroups.length} new muscle groups`)
    } else {
      console.log("No new muscle groups to insert")
    }

    // Get all muscle groups (including newly inserted ones)
    const allMuscleGroups = await db.select().from(muscleGroups)
    const muscleGroupMap = new Map(allMuscleGroups.map((group) => [group.name, group.id]))

    // Get existing exercises
    console.log("Checking existing exercises...")
    const existingExercises = await db.select().from(exercises)
    const existingExerciseNames = new Set(existingExercises.map((e) => e.name))

    // Filter out existing exercises
    const newExercises = exercisesData.filter(
      (exercise) => !existingExerciseNames.has(exercise.name),
    )

    if (newExercises.length > 0) {
      console.log(`Inserting ${newExercises.length} new exercises...`)
      const exercisesInserts = newExercises.map((exercise) => ({
        name: exercise.name,
        description: exercise.description,
        measurementType: exercise.measurementType as MeasurementType,
        primaryMuscleGroupId: muscleGroupMap.get(exercise.primaryMuscleGroup),
      }))

      await db.insert(exercises).values(exercisesInserts).onConflictDoNothing()
      console.log(`✅ Inserted ${newExercises.length} new exercises`)
    } else {
      console.log("No new exercises to insert")
    }

    // Get all exercises (including newly inserted ones)
    const allExercises = await db.select().from(exercises)
    const exerciseMap = new Map(allExercises.map((exercise) => [exercise.name, exercise.id]))

    // Get existing exercise-muscle group relationships
    console.log("Checking existing exercise-muscle group relationships...")
    const existingRelationships = await db.select().from(exerciseMuscleGroups)
    const existingRelationshipKeys = new Set(
      existingRelationships.map((r) => `${r.exerciseId}-${r.muscleGroupId}`),
    )

    // Create new relationships
    const newRelationships = exercisesData.flatMap((exercise) =>
      (exercise.accessoryMuscleGroups || [])
        .map((muscleGroupName) => {
          const exerciseId = exerciseMap.get(exercise.name)
          const muscleGroupId = muscleGroupMap.get(muscleGroupName)
          if (!exerciseId || !muscleGroupId) {
            console.warn(
              `⚠️ Skipping relationship: ${exercise.name} -> ${muscleGroupName} (missing IDs)`,
            )
            return null
          }
          const key = `${exerciseId}-${muscleGroupId}`
          return existingRelationshipKeys.has(key)
            ? null
            : {
                exerciseId,
                muscleGroupId,
              }
        })
        .filter((r): r is NonNullable<typeof r> => r !== null),
    )

    if (newRelationships.length > 0) {
      console.log(`Inserting ${newRelationships.length} new exercise-muscle group relationships...`)
      await db.insert(exerciseMuscleGroups).values(newRelationships).onConflictDoNothing()
      console.log(`✅ Inserted ${newRelationships.length} new relationships`)
    } else {
      console.log("No new exercise-muscle group relationships to insert")
    }

    console.log("✅ Seed completed successfully!")
  } catch (error) {
    console.error("❌ Error during seed:", error)
    throw error
  }
}

// Execute the seed function
seed()
  .catch((error) => {
    console.error("Failed to seed database:", error)
    process.exit(1)
  })
  .finally(() => {
    // Close the database connection if needed
    // If you're using a connection pool or similar, you might want to close it here
    process.exit(0)
  })
