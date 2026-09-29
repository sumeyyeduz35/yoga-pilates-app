import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import type { PreferredDiscipline } from '@/features/onboarding/types/onboarding';
import { useOnboardingStore } from '@/features/onboarding/use-onboarding-store';

const disciplines: {
  value: PreferredDiscipline;
  title: string;
  description: string;
}[] = [
  {
    value: 'yoga',
    title: 'Yoga',
    description: 'Improve mobility, balance and mind-body awareness.',
  },
  {
    value: 'pilates',
    title: 'Pilates',
    description: 'Build core strength, control and stability.',
  },
  {
    value: 'reformer',
    title: 'Reformer',
    description: 'Train with controlled resistance and precise movement.',
  },
];

export default function OnboardingDisciplinesScreen() {
  const preferredDisciplines = useOnboardingStore(
    (state) => state.preferredDisciplines,
  );

  const toggleDiscipline = useOnboardingStore(
    (state) => state.toggleDiscipline,
  );

  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-16">
      <Typography variant="caption" tone="muted">
        STEP 2 OF 4
      </Typography>

      <Typography variant="h1" className="mt-2">
        What would you like to practice?
      </Typography>

      <Typography variant="body" tone="muted" className="mt-2">
        Choose one or more disciplines. You can change these preferences later.
      </Typography>

      <View className="mt-8 flex-1 gap-3">
        {disciplines.map((item) => {
          const selected = preferredDisciplines.includes(item.value);

          return (
            <Pressable
              key={item.value}
              onPress={() => toggleDiscipline(item.value)}
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

              <Typography variant="bodySmall" tone="muted" className="mt-1">
                {item.description}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Continue"
        disabled={preferredDisciplines.length === 0}
        onPress={() => router.push('/(onboarding)/experience')}
      />
    </View>
  );
}