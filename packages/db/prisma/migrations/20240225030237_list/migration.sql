-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "userProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "height" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "measurementEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primaryMuscleGroupId" TEXT NOT NULL,
    "description" TEXT,
    "commonPitfalls" TEXT,
    "thumbnailUrl" TEXT,
    "gifUrl" TEXT,
    "measurementType" TEXT NOT NULL,
    CONSTRAINT "exercise_primaryMuscleGroupId_fkey" FOREIGN KEY ("primaryMuscleGroupId") REFERENCES "muscleGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "muscleGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "timer" INTEGER,
    "notes" TEXT,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "workout_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workoutTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "timer" INTEGER,
    "notes" TEXT,
    "workoutId" TEXT,
    CONSTRAINT "workoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "workoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workout" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutExerciseSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weight" REAL,
    "numReps" INTEGER,
    "time" INTEGER,
    "distance" REAL,
    "complete" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "workoutExerciseId" TEXT,
    CONSTRAINT "workoutExerciseSet_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "workoutExercise" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "workoutPlanId" TEXT,
    CONSTRAINT "workoutTemplate_workoutPlanId_fkey" FOREIGN KEY ("workoutPlanId") REFERENCES "workoutPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutTemplateExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "workoutTemplateId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    CONSTRAINT "workoutTemplateExercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "workoutTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "workoutTemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutTemplateExerciseSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutTemplateExerciseId" TEXT NOT NULL,
    "weight" REAL,
    "numReps" INTEGER,
    "time" INTEGER,
    "distance" REAL,
    CONSTRAINT "workoutTemplateExerciseSet_workoutTemplateExerciseId_fkey" FOREIGN KEY ("workoutTemplateExerciseId") REFERENCES "workoutTemplateExercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workoutPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT
);

-- CreateTable
CREATE TABLE "workoutPlanTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    CONSTRAINT "workoutPlanTemplate_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workoutTemplate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SecondaryMuscleGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SecondaryMuscleGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SecondaryMuscleGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "muscleGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "measurementEntry_userId_idx" ON "measurementEntry"("userId");

-- CreateIndex
CREATE INDEX "exercise_primaryMuscleGroupId_idx" ON "exercise"("primaryMuscleGroupId");

-- CreateIndex
CREATE INDEX "workout_userId_idx" ON "workout"("userId");

-- CreateIndex
CREATE INDEX "workout_templateId_idx" ON "workout"("templateId");

-- CreateIndex
CREATE INDEX "workoutExercise_exerciseId_idx" ON "workoutExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "workoutExercise_workoutId_idx" ON "workoutExercise"("workoutId");

-- CreateIndex
CREATE INDEX "workoutExerciseSet_workoutExerciseId_idx" ON "workoutExerciseSet"("workoutExerciseId");

-- CreateIndex
CREATE INDEX "workoutTemplate_userId_idx" ON "workoutTemplate"("userId");

-- CreateIndex
CREATE INDEX "workoutTemplate_workoutPlanId_idx" ON "workoutTemplate"("workoutPlanId");

-- CreateIndex
CREATE INDEX "workoutTemplateExercise_workoutTemplateId_idx" ON "workoutTemplateExercise"("workoutTemplateId");

-- CreateIndex
CREATE INDEX "workoutTemplateExercise_exerciseId_idx" ON "workoutTemplateExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "workoutTemplateExerciseSet_workoutTemplateExerciseId_idx" ON "workoutTemplateExerciseSet"("workoutTemplateExerciseId");

-- CreateIndex
CREATE INDEX "workoutPlan_userId_idx" ON "workoutPlan"("userId");

-- CreateIndex
CREATE INDEX "workoutPlanTemplate_templateId_idx" ON "workoutPlanTemplate"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "_SecondaryMuscleGroup_AB_unique" ON "_SecondaryMuscleGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_SecondaryMuscleGroup_B_index" ON "_SecondaryMuscleGroup"("B");
