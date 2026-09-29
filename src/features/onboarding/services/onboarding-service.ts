import { supabase } from '@/lib/supabase';

import type { UserPreferences } from '../types/onboarding';

export async function saveUserPreferences(
  preferences: UserPreferences,
): Promise<void> {
  const { error: preferencesError } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: preferences.userId,
        goal: preferences.goal,
        experience_level: preferences.experienceLevel,
        preferred_disciplines: preferences.preferredDisciplines,
        workout_duration: preferences.workoutDuration,
      },
      {
        onConflict: 'user_id',
      },
    );

  if (preferencesError) {
    throw preferencesError;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      onboarding_completed: true,
    })
    .eq('id', preferences.userId);

  if (profileError) {
    throw profileError;
  }
}

export async function getUserPreferences(
  userId: string,
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select(
      'user_id, goal, experience_level, preferred_disciplines, workout_duration',
    )
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    userId: data.user_id,
    goal: data.goal as UserPreferences['goal'],
    experienceLevel:
      data.experience_level as UserPreferences['experienceLevel'],
    preferredDisciplines:
      data.preferred_disciplines as UserPreferences['preferredDisciplines'],
    workoutDuration:
      data.workout_duration as UserPreferences['workoutDuration'],
  };
}