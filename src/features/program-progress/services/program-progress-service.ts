import { supabase } from '@/lib/supabase';

import type {
  UserProgram,
  UserProgramExerciseProgress,
  UserProgramStatus,
} from '../types/program-progress';

type UserProgramRow = {
  id: string;
  user_id: string;
  program_id: string;
  status: UserProgramStatus;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

type UserProgramExerciseProgressRow = {
  id: string;
  user_program_id: string;
  program_exercise_id: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapUserProgram(
  row: UserProgramRow,
): UserProgram {
  return {
    id: row.id,
    userId: row.user_id,
    programId: row.program_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExerciseProgress(
  row: UserProgramExerciseProgressRow,
): UserProgramExerciseProgress {
  return {
    id: row.id,
    userProgramId: row.user_program_id,
    programExerciseId: row.program_exercise_id,
    isCompleted: row.is_completed,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserProgram(
  userId: string,
  programId: string,
): Promise<UserProgram | null> {
  const { data, error } = await supabase
    .from('user_programs')
    .select(
      'id, user_id, program_id, status, started_at, completed_at, created_at, updated_at',
    )
    .eq('user_id', userId)
    .eq('program_id', programId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapUserProgram(
    data as UserProgramRow,
  );
}

export async function getActiveUserPrograms(
  userId: string,
): Promise<UserProgram[]> {
  const { data, error } = await supabase
    .from('user_programs')
    .select(
      'id, user_id, program_id, status, started_at, completed_at, created_at, updated_at',
    )
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('updated_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data as UserProgramRow[]
  ).map(mapUserProgram);
}

export async function startProgram(
  userId: string,
  programId: string,
): Promise<UserProgram> {
  const existingProgram =
    await getUserProgram(
      userId,
      programId,
    );

  if (existingProgram) {
    return existingProgram;
  }

  const { data, error } = await supabase
    .from('user_programs')
    .insert({
      user_id: userId,
      program_id: programId,
      status: 'in_progress',
    })
    .select(
      'id, user_id, program_id, status, started_at, completed_at, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  return mapUserProgram(
    data as UserProgramRow,
  );
}

export async function getUserProgramExerciseProgress(
  userProgramId: string,
): Promise<UserProgramExerciseProgress[]> {
  const { data, error } = await supabase
    .from('user_program_exercise_progress')
    .select(
      'id, user_program_id, program_exercise_id, is_completed, completed_at, created_at, updated_at',
    )
    .eq(
      'user_program_id',
      userProgramId,
    );

  if (error) {
    throw error;
  }

  return (
    data as UserProgramExerciseProgressRow[]
  ).map(mapExerciseProgress);
}

export async function setProgramExerciseCompleted(
  userProgramId: string,
  programExerciseId: string,
  isCompleted: boolean,
): Promise<UserProgramExerciseProgress> {
  const completedAt = isCompleted
    ? new Date().toISOString()
    : null;

  const { data, error } = await supabase
    .from(
      'user_program_exercise_progress',
    )
    .upsert(
      {
        user_program_id:
          userProgramId,
        program_exercise_id:
          programExerciseId,
        is_completed: isCompleted,
        completed_at: completedAt,
      },
      {
        onConflict:
          'user_program_id,program_exercise_id',
      },
    )
    .select(
      'id, user_program_id, program_exercise_id, is_completed, completed_at, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  return mapExerciseProgress(
    data as UserProgramExerciseProgressRow,
  );
}

export async function completeProgram(
  userProgramId: string,
): Promise<UserProgram> {
  const { data, error } = await supabase
    .from('user_programs')
    .update({
      status: 'completed',
      completed_at:
        new Date().toISOString(),
    })
    .eq('id', userProgramId)
    .select(
      'id, user_id, program_id, status, started_at, completed_at, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  return mapUserProgram(
    data as UserProgramRow,
  );
}

export async function restartProgram(
  userProgramId: string,
): Promise<UserProgram> {
  const { error: progressError } =
    await supabase
      .from(
        'user_program_exercise_progress',
      )
      .update({
        is_completed: false,
        completed_at: null,
      })
      .eq(
        'user_program_id',
        userProgramId,
      );

  if (progressError) {
    throw progressError;
  }

  const { data, error } = await supabase
    .from('user_programs')
    .update({
      status: 'in_progress',
      started_at:
        new Date().toISOString(),
      completed_at: null,
    })
    .eq('id', userProgramId)
    .select(
      'id, user_id, program_id, status, started_at, completed_at, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  return mapUserProgram(
    data as UserProgramRow,
  );
}