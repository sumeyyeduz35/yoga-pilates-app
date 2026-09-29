export type UserGoal =
  | 'flexibility'
  | 'strength'
  | 'stress_relief'
  | 'posture'
  | 'general_fitness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type PreferredDiscipline = 'yoga' | 'pilates' | 'reformer';

export type WorkoutDuration = 15 | 30 | 45 | 60;

export interface UserPreferences {
  userId: string;
  goal: UserGoal;
  experienceLevel: ExperienceLevel;
  preferredDisciplines: PreferredDiscipline[];
  workoutDuration: WorkoutDuration;
}

export interface OnboardingFormData {
  goal: UserGoal | null;
  experienceLevel: ExperienceLevel | null;
  preferredDisciplines: PreferredDiscipline[];
  workoutDuration: WorkoutDuration | null;
}