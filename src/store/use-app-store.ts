import { create } from 'zustand';

export type Discipline = 'yoga' | 'pilates';

type AppState = {
  selectedDiscipline: Discipline | null;
  setSelectedDiscipline: (discipline: Discipline) => void;
  clearSelectedDiscipline: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedDiscipline: null,

  setSelectedDiscipline: (discipline) => {
    set({ selectedDiscipline: discipline });
  },

  clearSelectedDiscipline: () => {
    set({ selectedDiscipline: null });
  },
}));
