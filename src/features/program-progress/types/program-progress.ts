export type UserProgramStatus = 'in_progress' | 'completed' | 'abandoned';

export interface UserProgram {
  id: string;
  userId: string;
  programId: string;

  status: UserProgramStatus;

  startedAt: string;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface UserProgramExerciseProgress {
  id: string;
  userProgramId: string;
  programExerciseId: string;

  isCompleted: boolean;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
