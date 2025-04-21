CREATE TABLE `exercise_muscle_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`muscle_group_id` text NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_group_exercise_id` ON `exercise_muscle_groups` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `idx_exercise_muscle_group_muscle_group_id` ON `exercise_muscle_groups` (`muscle_group_id`);--> statement-breakpoint
CREATE TABLE `exercise_sets` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_exercise_id` integer NOT NULL,
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
CREATE INDEX `idx_exercise_sets_workout_exercise` ON `exercise_sets` (`workout_exercise_id`,`order`);--> statement-breakpoint
CREATE INDEX `idx_exercise_set_completed_at` ON `exercise_sets` (`completed_at`);--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`measurement_type` text NOT NULL,
	`primary_muscle_group_id` text,
	`creator_id` text,
	`description` text,
	`default_rest_time` integer,
	`thumbnail_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_exercise_name` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `idx_exercises_measurement_type` ON `exercises` (`measurement_type`);--> statement-breakpoint
CREATE INDEX `idx_exercise_primary_muscle_group_id` ON `exercises` (`primary_muscle_group_id`);--> statement-breakpoint
CREATE TABLE `muscle_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `muscle_groups_name_unique` ON `muscle_groups` (`name`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order` integer NOT NULL,
	`rest_time` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_workout_exercise_workout_id_order` ON `workout_exercises` (`workout_id`,`order`);--> statement-breakpoint
CREATE INDEX `idx_workout_exercises_exercise` ON `workout_exercises` (`exercise_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_workout_user_id` ON `workouts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_workout_start_time` ON `workouts` (`start_time`);