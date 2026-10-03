import type {
    ExerciseSession,
    ExerciseSessionProgress,
} from '../types/exercise-session';

export function startExerciseSession(
  session: ExerciseSession,
): ExerciseSession {
  return {
    ...session,
    status: 'active',
    startedAt: session.startedAt ?? new Date().toISOString(),
    pausedAt: null,
  };
}

export function pauseExerciseSession(
  session: ExerciseSession,
): ExerciseSession {
  if (session.status !== 'active') {
    return session;
  }

  return {
    ...session,
    status: 'paused',
    pausedAt: new Date().toISOString(),
  };
}

export function resumeExerciseSession(
  session: ExerciseSession,
): ExerciseSession {
  if (session.status !== 'paused') {
    return session;
  }

  return {
    ...session,
    status: 'active',
    pausedAt: null,
  };
}

export function goToNextExercise(
  session: ExerciseSession,
): ExerciseSession {
  const nextIndex = Math.min(
    session.currentExerciseIndex + 1,
    session.exercises.length - 1,
  );

  return {
    ...session,
    currentExerciseIndex: nextIndex,
  };
}

export function goToPreviousExercise(
  session: ExerciseSession,
): ExerciseSession {
  return {
    ...session,
    currentExerciseIndex: Math.max(
      session.currentExerciseIndex - 1,
      0,
    ),
  };
}

export function completeExerciseSession(
  session: ExerciseSession,
): ExerciseSession {
  return {
    ...session,
    status: 'completed',
    completedAt: new Date().toISOString(),
    pausedAt: null,
  };
}

export function cancelExerciseSession(
  session: ExerciseSession,
): ExerciseSession {
  return {
    ...session,
    status: 'cancelled',
    pausedAt: null,
  };
}

export function getExerciseSessionProgress(
  session: ExerciseSession,
): ExerciseSessionProgress {
  const totalExerciseCount = session.exercises.length;

  if (totalExerciseCount === 0) {
    return {
      currentExerciseIndex: 0,
      completedExerciseCount: 0,
      totalExerciseCount: 0,
      progressPercentage: 0,
    };
  }

  const completedExerciseCount = Math.min(
    session.currentExerciseIndex,
    totalExerciseCount,
  );

  return {
    currentExerciseIndex: session.currentExerciseIndex,
    completedExerciseCount,
    totalExerciseCount,
    progressPercentage:
      (completedExerciseCount / totalExerciseCount) * 100,
  };
}