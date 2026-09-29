import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { saveUserPreferences } from '@/features/onboarding/services/onboarding-service';
import type { WorkoutDuration } from '@/features/onboarding/types/onboarding';
import { useOnboardingStore } from '@/features/onboarding/use-onboarding-store';
import { useAuth } from '@/providers/auth-provider';

const durations: {
  value: WorkoutDuration;
  title: string;
  description: string;
}[] = [
  {
    value: 15,
    title: '15 min',
    description: 'Quick sessions for busy days.',
  },
  {
    value: 30,
    title: '30 min',
    description: 'A balanced session that fits most routines.',
  },
  {
    value: 45,
    title: '45 min',
    description: 'More time for a complete practice.',
  },
  {
    value: 60,
    title: '60 min',
    description: 'A full-length and immersive session.',
  },
];

export default function OnboardingDurationScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goal = useOnboardingStore((state) => state.goal);

  const experienceLevel = useOnboardingStore(
    (state) => state.experienceLevel,
  );

  const preferredDisciplines = useOnboardingStore(
    (state) => state.preferredDisciplines,
  );

  const workoutDuration = useOnboardingStore(
    (state) => state.workoutDuration,
  );

  const setWorkoutDuration = useOnboardingStore(
    (state) => state.setWorkoutDuration,
  );

  const reset = useOnboardingStore((state) => state.reset);

  const { user, refreshProfile } = useAuth();

  async function handleComplete() {
    if (
      !user ||
      !goal ||
      !experienceLevel ||
      preferredDisciplines.length === 0 ||
      !workoutDuration
    ) {
      Alert.alert(
        'Missing information',
        'Please complete all onboarding steps before continuing.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await saveUserPreferences({
        userId: user.id,
        goal,
        experienceLevel,
        preferredDisciplines,
        workoutDuration,
      });

      await refreshProfile();

      reset();

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Onboarding save error:', error);

      Alert.alert(
        'Something went wrong',
        'We could not save your preferences. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-16">
      <Typography variant="caption" tone="muted">
        STEP 4 OF 4
      </Typography>

      <Typography variant="h1" className="mt-2">
        How long would you like to practice?
      </Typography>

      <Typography variant="body" tone="muted" className="mt-2">
        Choose the session length that fits your routine best.
      </Typography>

      <View className="mt-8 flex-1 gap-3">
        {durations.map((item) => {
          const selected = workoutDuration === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setWorkoutDuration(item.value)}
              className={`rounded-2xl border p-5 ${
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface'
              }`}
            >
              <Typography
                variant="h3"
                tone={selected ? 'primary' : 'default'}
              >
                {item.title}
              </Typography>

              <Typography
                variant="bodySmall"
                tone="muted"
                className="mt-1"
              >
                {item.description}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Button
        label={isSubmitting ? 'Saving...' : 'Complete setup'}
        disabled={!workoutDuration || isSubmitting}
        onPress={handleComplete}
      />
    </View>
  );
}