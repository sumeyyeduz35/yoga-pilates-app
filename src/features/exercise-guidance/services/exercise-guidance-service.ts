import {
    pilotExerciseGuidanceConfigs,
} from '../config/pilot-exercise-guidance';

import type {
    ExerciseGuidanceConfig,
} from '../types/exercise-guidance';

export function getExerciseGuidanceConfig(
  exerciseSlug: string | null | undefined,
): ExerciseGuidanceConfig | null {
  if (!exerciseSlug) {
    return null;
  }

  return (
    pilotExerciseGuidanceConfigs[exerciseSlug] ??
    null
  );
}

export function hasExerciseGuidanceConfig(
  exerciseSlug: string | null | undefined,
): boolean {
  return (
    getExerciseGuidanceConfig(exerciseSlug) !==
    null
  );
}