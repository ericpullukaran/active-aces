PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`weight` real,
	`reps` integer,
	`distance` real,
	`time` integer,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_exercise_sets`("id", "workout_exercise_id", "order", "weight", "reps", "distance", "time", "completed", "completed_at") SELECT "id", "workout_exercise_id", "order", "weight", "reps", "distance", "time", "completed", "completed_at" FROM `exercise_sets`;--> statement-breakpoint
DROP TABLE `exercise_sets`;--> statement-breakpoint
ALTER TABLE `__new_exercise_sets` RENAME TO `exercise_sets`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_exercise_sets_workout_exercise` ON `exercise_sets` (`workout_exercise_id`,`order`);--> statement-breakpoint
CREATE INDEX `idx_exercise_set_completed_at` ON `exercise_sets` (`completed_at`);