import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/auth-provider';

export default function Index() {
  const { session, profile, isLoading, profileError } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (profileError) {
    return null;
  }

  if (!profile) {
    return null;
  }

  if (!profile.onboarding_completed) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}