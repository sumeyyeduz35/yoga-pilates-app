import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import type { UserGoal } from '@/features/onboarding/types/onboarding';
import { useOnboardingStore } from '@/features/onboarding/use-onboarding-store';

const goals: {
  value: UserGoal;
  title: string;
  description: string;
}[] = [
  {
    value: 'flexibility',
    title: 'Improve flexibility',
    description: 'Move more freely and improve your mobility.',
  },
  {
    value: 'strength',
    title: 'Build strength',
    description: 'Develop a stronger and more capable body.',
  },
  {
    value: 'stress_relief',
    title: 'Reduce stress',
    description: 'Create space to slow down and reset.',
  },
  {
    value: 'posture',
    title: 'Improve posture',
    description: 'Build better alignment and body awareness.',
  },
  {
    value: 'general_fitness',
    title: 'General fitness',
    description: 'Build a balanced and consistent movement routine.',
  },
];

export default function OnboardingGoalScreen() {
  const goal = useOnboardingStore((state) => state.goal);
  const setGoal = useOnboardingStore((state) => state.setGoal);

  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-16">
      <Typography variant="caption" tone="muted">
        STEP 1 OF 4
      </Typography>

      <Typography variant="h1" className="mt-2">
        What would you like to focus on?
      </Typography>

      <Typography variant="body" tone="muted" className="mt-2">
        Choose the goal that matters most to you right now.
      </Typography>

      <View className="mt-8 flex-1 gap-3">
        {goals.map((item) => {
          const selected = goal === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setGoal(item.value)}
              className={`rounded-2xl border p-4 ${
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

              <Typography variant="bodySmall" tone="muted" className="mt-1">
                {item.description}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Continue"
        disabled={!goal}
        onPress={() => router.push('/(onboarding)/disciplines')}
      />
    </View>
  );
}