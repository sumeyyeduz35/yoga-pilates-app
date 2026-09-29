import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import type { ExperienceLevel } from '@/features/onboarding/types/onboarding';
import { useOnboardingStore } from '@/features/onboarding/use-onboarding-store';

const experienceLevels: {
  value: ExperienceLevel;
  title: string;
  description: string;
}[] = [
  {
    value: 'beginner',
    title: 'Beginner',
    description: 'I am new or still building confidence with movement.',
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'I practice regularly and know the fundamentals.',
  },
  {
    value: 'advanced',
    title: 'Advanced',
    description: 'I have strong experience and want more challenging sessions.',
  },
];

export default function OnboardingExperienceScreen() {
  const experienceLevel = useOnboardingStore(
    (state) => state.experienceLevel,
  );

  const setExperienceLevel = useOnboardingStore(
    (state) => state.setExperienceLevel,
  );

  return (
    <View className="flex-1 bg-background px-6 pb-10 pt-16">
      <Typography variant="caption" tone="muted">
        STEP 3 OF 4
      </Typography>

      <Typography variant="h1" className="mt-2">
        What&apos;s your experience level?
      </Typography>

      <Typography variant="body" tone="muted" className="mt-2">
        This helps us recommend sessions that match your current level.
      </Typography>

      <View className="mt-8 flex-1 gap-3">
        {experienceLevels.map((item) => {
          const selected = experienceLevel === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() => setExperienceLevel(item.value)}
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
        disabled={!experienceLevel}
        onPress={() => router.push('/(onboarding)/duration')}
      />
    </View>
  );
}