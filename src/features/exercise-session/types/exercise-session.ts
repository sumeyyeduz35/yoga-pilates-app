export type ExerciseSessionStatus =
  | 'idle'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type ExerciseSessionPhase =
  | 'ready'
  | 'countdown'
  | 'active'
  | 'paused'
  | 'resting'
  | 'completed';

export type ExerciseSessionExercise = {
  id: string;
  exerciseId: string;
  name: string;
  order: number;
  durationSeconds: number | null;
  repetitionCount: number | null;
  restSeconds: number | null;
};

export type ExerciseSession = {
  id: string;
  programId: string;
  programDayId: string | null;

  status: ExerciseSessionStatus;
  phase: ExerciseSessionPhase;

  currentExerciseIndex: number;

  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;

  elapsedSeconds: number;

  exercises: ExerciseSessionExercise[];
};

export type ExerciseSessionProgress = {
  currentExerciseIndex: number;
  completedExerciseCount: number;
  totalExerciseCount: number;
  progressPercentage: number;
};

export type ExerciseSessionSummary = {
  completedExerciseCount: number;
  totalExerciseCount: number;
  elapsedSeconds: number;
  progressPercentage: number;
};