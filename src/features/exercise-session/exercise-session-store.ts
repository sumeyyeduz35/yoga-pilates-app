import { create } from 'zustand';

import {
  completeExerciseSession,
  goToNextExercise,
  goToPreviousExercise,
  pauseExerciseSession,
  resumeExerciseSession,
  startExerciseSession,
} from './services/exercise-session-service';

import type {
  ExerciseSession,
  ExerciseSessionPhase,
} from './types/exercise-session';

type ExerciseSessionStore = {
  session: ExerciseSession | null;

  remainingSeconds: number | null;
  restRemainingSeconds: number | null;
  countdownSeconds: number | null;

  setSession: (session: ExerciseSession) => void;
  clearSession: () => void;

  startCountdown: () => void;
  decrementCountdown: () => void;
  startCurrentExercise: () => void;

  pause: () => void;
  resume: () => void;

  nextExercise: () => void;
  previousExercise: () => void;

  complete: () => void;

  setRemainingSeconds: (seconds: number | null) => void;
  decrementRemainingSeconds: () => void;

  startRest: (seconds: number) => void;
  decrementRest: () => void;
  finishRest: () => void;

  setPhase: (phase: ExerciseSessionPhase) => void;
  incrementElapsedSeconds: () => void;
};

export const useExerciseSessionStore =
  create<ExerciseSessionStore>((set) => ({
    session: null,

    remainingSeconds: null,
    restRemainingSeconds: null,
    countdownSeconds: null,

    setSession: (session) => {
      set({
        session,
        remainingSeconds: null,
        restRemainingSeconds: null,
        countdownSeconds: null,
      });
    },

    clearSession: () => {
      set({
        session: null,
        remainingSeconds: null,
        restRemainingSeconds: null,
        countdownSeconds: null,
      });
    },

    startCountdown: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        return {
          session: {
            ...state.session,
            phase: 'countdown',
          },
          countdownSeconds: 3,
        };
      });
    },

    decrementCountdown: () => {
      set((state) => ({
        countdownSeconds:
          state.countdownSeconds === null
            ? null
            : Math.max(state.countdownSeconds - 1, 0),
      }));
    },

    startCurrentExercise: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const currentExercise =
          state.session.exercises[
            state.session.currentExerciseIndex
          ];

        const startedSession =
          startExerciseSession(state.session);

        return {
          session: {
            ...startedSession,
            phase: 'active',
          },
          remainingSeconds:
            currentExercise?.durationSeconds ?? null,
          countdownSeconds: null,
          restRemainingSeconds: null,
        };
      });
    },

    pause: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const pausedSession =
          pauseExerciseSession(state.session);

        return {
          session: {
            ...pausedSession,
            phase: 'paused',
          },
        };
      });
    },

    resume: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const resumedSession =
          resumeExerciseSession(state.session);

        return {
          session: {
            ...resumedSession,
            phase: 'active',
          },
        };
      });
    },

    nextExercise: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const nextSession =
          goToNextExercise(state.session);

        return {
          session: {
            ...nextSession,
            status: 'idle',
            phase: 'ready',
          },
          remainingSeconds: null,
          restRemainingSeconds: null,
          countdownSeconds: null,
        };
      });
    },

    previousExercise: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const previousSession =
          goToPreviousExercise(state.session);

        return {
          session: {
            ...previousSession,
            status: 'idle',
            phase: 'ready',
          },
          remainingSeconds: null,
          restRemainingSeconds: null,
          countdownSeconds: null,
        };
      });
    },

    complete: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        const completedSession =
          completeExerciseSession(state.session);

        return {
          session: {
            ...completedSession,
            phase: 'completed',
          },
          remainingSeconds: null,
          restRemainingSeconds: null,
          countdownSeconds: null,
        };
      });
    },

    setRemainingSeconds: (seconds) => {
      set({
        remainingSeconds: seconds,
      });
    },

    decrementRemainingSeconds: () => {
      set((state) => ({
        remainingSeconds:
          state.remainingSeconds === null
            ? null
            : Math.max(
                state.remainingSeconds - 1,
                0,
              ),
      }));
    },

    startRest: (seconds) => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        return {
          session: {
            ...state.session,
            phase: 'resting',
          },
          remainingSeconds: null,
          restRemainingSeconds: seconds,
          countdownSeconds: null,
        };
      });
    },

    decrementRest: () => {
      set((state) => ({
        restRemainingSeconds:
          state.restRemainingSeconds === null
            ? null
            : Math.max(
                state.restRemainingSeconds - 1,
                0,
              ),
      }));
    },

    finishRest: () => {
      set({
        restRemainingSeconds: null,
      });
    },

    setPhase: (phase) => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        return {
          session: {
            ...state.session,
            phase,
          },
        };
      });
    },

    incrementElapsedSeconds: () => {
      set((state) => {
        if (!state.session) {
          return state;
        }

        return {
          session: {
            ...state.session,
            elapsedSeconds:
              state.session.elapsedSeconds + 1,
          },
        };
      });
    },
  }));