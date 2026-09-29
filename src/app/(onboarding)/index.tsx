import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';

export default function OnboardingWelcomeScreen() {
  return (
    <View className="flex-1 justify-between bg-background px-6 pb-10 pt-16">
      <View>
        <Typography variant="label" tone="primary">
          YOUR JOURNEY
        </Typography>

        <Typography variant="display" className="mt-3">
          Find the movement that feels right for you.
        </Typography>

        <Typography variant="body" tone="muted" className="mt-4">
          Tell us a little about yourself so we can personalize your Yoga,
          Pilates and Reformer experience.
        </Typography>
      </View>

      <Button
        label="Get started"
        onPress={() => router.push('/(onboarding)/goal')}
      />
    </View>
  );
}