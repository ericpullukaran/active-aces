DROP INDEX "idx_exercise_muscle_group_exercise_id";--> statement-breakpoint
DROP INDEX "idx_exercise_muscle_group_muscle_group_id";--> statement-breakpoint
DROP INDEX "idx_exercise_sets_workout_exercise";--> statement-breakpoint
DROP INDEX "idx_exercise_set_completed_at";--> statement-breakpoint
DROP INDEX "idx_exercise_name";--> statement-breakpoint
DROP INDEX "idx_exercises_measurement_type";--> statement-breakpoint
DROP INDEX "idx_exercise_primary_muscle_group_id";--> statement-breakpoint
DROP INDEX "muscle_groups_name_unique";--> statement-breakpoint
DROP INDEX "idx_workout_exercise_workout_id_order";--> statement-breakpoint
DROP INDEX "idx_workout_exercises_exercise";--> statement-breakpoint
DROP INDEX "idx_workout_user_id";--> statement-breakpoint
DROP INDEX "idx_workout_start_time";--> statement-breakpoint
ALTER TABLE `workouts` ALTER COLUMN "is_template" TO "is_template" integer;--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_group_exercise_id` ON `exercise_muscle_groups` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_group_muscle_group_id` ON `exercise_muscle_groups` (`muscle_group_id`);--> statement-breakpoint
CREATE INDEX `idx_exercise_sets_workout_exercise` ON `exercise_sets` (`workout_exercise_id`,`order`);--> statement-breakpoint
CREATE INDEX `idx_exercise_set_completed_at` ON `exercise_sets` (`completed_at`);--> statement-breakpoint
CREATE INDEX `idx_exercise_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_measurement_type` ON `exercises` (`measurement_type`);--> statement-breakpoint
CREATE INDEX `idx_exercise_primary_muscle_group_id` ON `exercises` (`primary_muscle_group_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `muscle_groups_name_unique` ON `muscle_groups` (`name`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercise_workout_id_order` ON `workout_exercises` (`workout_id`,`order`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise` ON `workout_exercises` (`exercise_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_workout_user_id` ON `workouts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_start_time` ON `workouts` (`start_time`);