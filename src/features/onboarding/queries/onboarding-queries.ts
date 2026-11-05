
import { useQuery } from '@tanstack/react-query';

import { getUserPreferences } from '../services/onboarding-service';

export const onboardingQueryKeys = {
  all: ['onboarding'] as const,

  preferences: (userId: string) =>
    [...onboardingQueryKeys.all, 'preferences', userId] as const,
};

export function useUserPreferencesQuery(userId: string | undefined) {
  return useQuery({
    queryKey: onboardingQueryKeys.preferences(userId ?? ''),
    queryFn: () => getUserPreferences(userId!),
    enabled: Boolean(userId),
  });
}
