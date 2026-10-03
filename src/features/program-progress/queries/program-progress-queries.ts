import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  completeProgram,
  getActiveUserPrograms,
  getUserProgram,
  getUserProgramExerciseProgress,
  restartProgram,
  setProgramExerciseCompleted,
  startProgram,
} from '../services/program-progress-service';

export const programProgressQueryKeys = {
  all: ['program-progress'] as const,

  activeUserPrograms: (
    userId: string,
  ) =>
    [
      ...programProgressQueryKeys.all,
      'active-user-programs',
      userId,
    ] as const,

  userProgram: (
    userId: string,
    programId: string,
  ) =>
    [
      ...programProgressQueryKeys.all,
      'user-program',
      userId,
      programId,
    ] as const,

  exerciseProgress: (
    userProgramId: string,
  ) =>
    [
      ...programProgressQueryKeys.all,
      'exercise-progress',
      userProgramId,
    ] as const,
};

export function useActiveUserProgramsQuery(
  userId: string | undefined,
) {
  return useQuery({
    queryKey:
      programProgressQueryKeys.activeUserPrograms(
        userId ?? '',
      ),

    queryFn: () =>
      getActiveUserPrograms(
        userId!,
      ),

    enabled: Boolean(userId),
  });
}

export function useUserProgramQuery(
  userId: string | undefined,
  programId: string | undefined,
) {
  return useQuery({
    queryKey:
      programProgressQueryKeys.userProgram(
        userId ?? '',
        programId ?? '',
      ),

    queryFn: () =>
      getUserProgram(
        userId!,
        programId!,
      ),

    enabled: Boolean(
      userId &&
      programId,
    ),
  });
}

export function useUserProgramExerciseProgressQuery(
  userProgramId: string | undefined,
) {
  return useQuery({
    queryKey:
      programProgressQueryKeys.exerciseProgress(
        userProgramId ?? '',
      ),

    queryFn: () =>
      getUserProgramExerciseProgress(
        userProgramId!,
      ),

    enabled: Boolean(userProgramId),
  });
}

export function useStartProgramMutation(
  userId: string | undefined,
  programId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userId || !programId) {
        throw new Error(
          'User ID and program ID are required.',
        );
      }

      return startProgram(
        userId,
        programId,
      );
    },

    onSuccess: (userProgram) => {
      queryClient.setQueryData(
        programProgressQueryKeys.userProgram(
          userProgram.userId,
          userProgram.programId,
        ),
        userProgram,
      );

      void queryClient.invalidateQueries({
        queryKey:
          programProgressQueryKeys.activeUserPrograms(
            userProgram.userId,
          ),
      });
    },
  });
}

export function useSetProgramExerciseCompletedMutation(
  userProgramId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programExerciseId,
      isCompleted,
    }: {
      programExerciseId: string;
      isCompleted: boolean;
    }) => {
      if (!userProgramId) {
        throw new Error(
          'User program ID is required.',
        );
      }

      return setProgramExerciseCompleted(
        userProgramId,
        programExerciseId,
        isCompleted,
      );
    },

    onSuccess: () => {
      if (!userProgramId) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey:
          programProgressQueryKeys.exerciseProgress(
            userProgramId,
          ),
      });
    },
  });
}

export function useCompleteProgramMutation(
  userId: string | undefined,
  programId: string | undefined,
  userProgramId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userProgramId) {
        throw new Error(
          'User program ID is required.',
        );
      }

      return completeProgram(
        userProgramId,
      );
    },

    onSuccess: (userProgram) => {
      if (userId && programId) {
        queryClient.setQueryData(
          programProgressQueryKeys.userProgram(
            userId,
            programId,
          ),
          userProgram,
        );

        void queryClient.invalidateQueries({
          queryKey:
            programProgressQueryKeys.activeUserPrograms(
              userId,
            ),
        });
      }

      if (userProgramId) {
        void queryClient.invalidateQueries({
          queryKey:
            programProgressQueryKeys.exerciseProgress(
              userProgramId,
            ),
        });
      }
    },
  });
}

export function useRestartProgramMutation(
  userId: string | undefined,
  programId: string | undefined,
  userProgramId: string | undefined,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userProgramId) {
        throw new Error(
          'User program ID is required.',
        );
      }

      return restartProgram(
        userProgramId,
      );
    },

    onSuccess: (userProgram) => {
      if (userId && programId) {
        queryClient.setQueryData(
          programProgressQueryKeys.userProgram(
            userId,
            programId,
          ),
          userProgram,
        );

        void queryClient.invalidateQueries({
          queryKey:
            programProgressQueryKeys.activeUserPrograms(
              userId,
            ),
        });
      }

      if (userProgramId) {
        void queryClient.invalidateQueries({
          queryKey:
            programProgressQueryKeys.exerciseProgress(
              userProgramId,
            ),
        });
      }
    },
  });
}