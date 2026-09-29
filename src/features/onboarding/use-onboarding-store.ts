import { create } from 'zustand';

import type {
    ExperienceLevel,
    OnboardingFormData,
    PreferredDiscipline,
    UserGoal,
    WorkoutDuration,
} from './types/onboarding';

const initialState: OnboardingFormData = {
  goal: null,
  experienceLevel: null,
  preferredDisciplines: [],
  workoutDuration: null,
};

type OnboardingStore = OnboardingFormData & {
  setGoal: (goal: UserGoal) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  toggleDiscipline: (discipline: PreferredDiscipline) => void;
  setWorkoutDuration: (duration: WorkoutDuration) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...initialState,

  setGoal: (goal) => {
    set({ goal });
  },

  setExperienceLevel: (experienceLevel) => {
    set({ experienceLevel });
  },

  toggleDiscipline: (discipline) => {
    set((state) => {
      const exists = state.preferredDisciplines.includes(discipline);

      return {
        preferredDisciplines: exists
          ? state.preferredDisciplines.filter((item) => item !== discipline)
          : [...state.preferredDisciplines, discipline],
      };
    });
  },

  setWorkoutDuration: (workoutDuration) => {
    set({ workoutDuration });
  },

  reset: () => {
    set(initialState);
  },
}));