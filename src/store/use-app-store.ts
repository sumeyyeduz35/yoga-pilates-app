import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { DisciplineKey } from '@/theme';

export type Discipline = DisciplineKey;
export type ThemePreference = 'system' | 'light' | 'dark';

type AppState = {
  selectedDiscipline: Discipline | null;
  setSelectedDiscipline: (discipline: Discipline) => void;
  clearSelectedDiscipline: () => void;

  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
};

type PersistedAppState = Pick<AppState, 'themePreference'>;

export const useAppStore = create<AppState>()(
  persist<AppState, [], [], PersistedAppState>(
    (set) => ({
      selectedDiscipline: null,

      setSelectedDiscipline: (discipline) => {
        set({ selectedDiscipline: discipline });
      },

      clearSelectedDiscipline: () => {
        set({ selectedDiscipline: null });
      },

      themePreference: 'system',

      setThemePreference: (preference) => {
        set({ themePreference: preference });
      },
    }),
    {
      name: 'sumos-app-preferences',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themePreference: state.themePreference,
      }),
    }
  )
);
