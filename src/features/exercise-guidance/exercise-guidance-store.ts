import { create } from 'zustand';

import type {
    ExerciseGuidancePlayerState,
    ExercisePlaybackRate,
    ExerciseView,
} from './types/exercise-guidance';

type ExerciseGuidanceStore =
  ExerciseGuidancePlayerState & {
    setView: (view: ExerciseView) => void;

    setPlaybackRate: (
      playbackRate: ExercisePlaybackRate,
    ) => void;

    setPaused: (isPaused: boolean) => void;

    toggleMuscles: () => void;

    toggleVoice: () => void;

    resetPlayer: () => void;
  };

const initialState: ExerciseGuidancePlayerState = {
  view: 'side',
  playbackRate: 1,
  isPaused: false,
  showMuscles: false,
  voiceEnabled: true,
};

export const useExerciseGuidanceStore =
  create<ExerciseGuidanceStore>((set) => ({
    ...initialState,

    setView: (view) => {
      set({
        view,
      });
    },

    setPlaybackRate: (playbackRate) => {
      set({
        playbackRate,
      });
    },

    setPaused: (isPaused) => {
      set({
        isPaused,
      });
    },

    toggleMuscles: () => {
      set((state) => ({
        showMuscles: !state.showMuscles,
      }));
    },

    toggleVoice: () => {
      set((state) => ({
        voiceEnabled: !state.voiceEnabled,
      }));
    },

    resetPlayer: () => {
      set(initialState);
    },
  }));