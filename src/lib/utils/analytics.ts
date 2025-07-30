"use client"

import { env } from "~/env"
import posthog from "posthog-js"

/**
 * Analytics utility for tracking user events and errors
 * Centralized PostHog integration following workspace rules
 */

// Feature flag enum for analytics
export const ANALYTICS_FLAGS = {
  TRACK_ERRORS: "track_errors",
  TRACK_WORKOUT_EVENTS: "track_workout_events",
  TRACK_TEMPLATE_EVENTS: "track_template_events",
  TRACK_EXERCISE_EVENTS: "track_exercise_events",
} as const

// Custom event names enum
export const ANALYTICS_EVENTS = {
  // Error events
  REPORT_ERROR: "report_error",
  HARD_RESET: "hard_reset",

  // Workout events
  WORKOUT_STARTED: "workout_started",
  WORKOUT_ENDED: "workout_ended",
  WORKOUT_DELETED: "workout_deleted",
  WORKOUT_PAUSED: "workout_paused",
  WORKOUT_RESUMED: "workout_resumed",

  // Template events
  TEMPLATE_CREATED: "template_created",
  TEMPLATE_USED: "template_used",
  TEMPLATE_DELETED: "template_deleted",

  // Exercise events
  EXERCISE_ADDED_TO_WORKOUT: "exercise_added_to_workout",
  EXERCISE_REMOVED_FROM_WORKOUT: "exercise_removed_from_workout",
  EXERCISE_CREATED: "exercise_created",
} as const

type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

interface BaseEventProperties {
  timestamp?: Date
  user_id?: string
  [key: string]: any
}

interface WorkoutEventProperties extends BaseEventProperties {
  workout_id?: string
  workout_name?: string
  exercise_count?: number
  duration_seconds?: number
  is_template?: boolean
}

interface TemplateEventProperties extends BaseEventProperties {
  template_id?: string
  template_name?: string
  exercise_count?: number
  source_workout_id?: string
}

interface ExerciseEventProperties extends BaseEventProperties {
  exercise_id?: string
  exercise_name?: string
  muscle_groups?: string[]
  workout_id?: string
  set_count?: number
}

/**
 * Main analytics tracking function
 */
function trackEvent(event: AnalyticsEvent, properties: BaseEventProperties = {}) {
  // Only track in production or development environments
  if (env.VERCEL_ENV !== "production" && env.VERCEL_ENV !== "development") {
    return
  }

  try {
    posthog.capture(event, {
      ...properties,
      timestamp: properties.timestamp || new Date(),
    })
  } catch (error) {
    // Fail silently to avoid breaking app functionality
    console.warn("Analytics tracking failed:", error)
  }
}

/**
 * Track workout events
 */
export const trackWorkout = {
  started: (properties?: Partial<WorkoutEventProperties>) => {
    trackEvent(ANALYTICS_EVENTS.WORKOUT_STARTED, properties)
  },

  ended: (properties?: WorkoutEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.WORKOUT_ENDED, properties)
  },

  deleted: (properties?: WorkoutEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.WORKOUT_DELETED, properties)
  },

  paused: (properties?: Partial<WorkoutEventProperties>) => {
    trackEvent(ANALYTICS_EVENTS.WORKOUT_PAUSED, properties)
  },

  resumed: (properties?: Partial<WorkoutEventProperties>) => {
    trackEvent(ANALYTICS_EVENTS.WORKOUT_RESUMED, properties)
  },
}

/**
 * Track template events
 */
export const trackTemplate = {
  created: (properties?: TemplateEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_CREATED, properties)
  },

  used: (properties?: TemplateEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_USED, properties)
  },

  deleted: (properties?: TemplateEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.TEMPLATE_DELETED, properties)
  },
}

/**
 * Track exercise events
 */
export const trackExercise = {
  addedToWorkout: (properties?: ExerciseEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.EXERCISE_ADDED_TO_WORKOUT, properties)
  },

  removedFromWorkout: (properties?: ExerciseEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.EXERCISE_REMOVED_FROM_WORKOUT, properties)
  },

  created: (properties?: ExerciseEventProperties) => {
    trackEvent(ANALYTICS_EVENTS.EXERCISE_CREATED, properties)
  },
}

/**
 * Generic track function for custom events
 */
export const track = trackEvent
