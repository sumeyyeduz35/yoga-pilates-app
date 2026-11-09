
import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    addWaterLog,
    deleteWaterLog,
    getWaterGoal,
    getWaterLogs,
    upsertWaterGoal,
    type AddWaterLogInput,
} from '../services/water-service';

export const waterQueryKeys = {
  all: ['water'] as const,

  logs: (userId: string, startDate: string, endDate: string) =>
    [...waterQueryKeys.all, 'logs', userId, startDate, endDate] as const,

  goal: (userId: string) =>
    [...waterQueryKeys.all, 'goal', userId] as const,
};

function assertNoError<T>(
  result: { data: T; error: { message: string } | null },
): T {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export function useWaterLogsQuery(
  userId: string | undefined,
  startDate: string,
  endDate: string,
) {
  return useQuery({
    queryKey: waterQueryKeys.logs(userId ?? '', startDate, endDate),
    queryFn: async () => {
      const result = await getWaterLogs(userId!, startDate, endDate);
      return assertNoError(result);
    },
    enabled: Boolean(userId && startDate && endDate),
  });
}

export function useWaterGoalQuery(userId: string | undefined) {
  return useQuery({
    queryKey: waterQueryKeys.goal(userId ?? ''),
    queryFn: async () => {
      const result = await getWaterGoal(userId!);
      return assertNoError(result);
    },
    enabled: Boolean(userId),
  });
}

export function useAddWaterLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddWaterLogInput) => {
      const result = await addWaterLog(input);
      return assertNoError(result);
    },
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({
        queryKey: [...waterQueryKeys.all, 'logs', input.userId],
      });
    },
  });
}

export function useDeleteWaterLogMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      logId,
    }: {
      userId: string;
      logId: string;
    }) => {
      const result = await deleteWaterLog(userId, logId);
      assertNoError(result);
    },
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({
        queryKey: [...waterQueryKeys.all, 'logs', input.userId],
      });
    },
  });
}

export function useUpsertWaterGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      dailyGoalMl,
    }: {
      userId: string;
      dailyGoalMl: number;
    }) => {
      const result = await upsertWaterGoal(userId, dailyGoalMl);
      return assertNoError(result);
    },
    onSuccess: (_data, input) => {
      void queryClient.invalidateQueries({
        queryKey: waterQueryKeys.goal(input.userId),
      });
    },
  });
}
