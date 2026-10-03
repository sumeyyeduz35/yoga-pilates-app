import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { Typography } from '@/components/ui/Typography';
import { SessionScreen } from '@/features/exercise-session/components/SessionScreen';
import { useTheme } from '@/providers/theme-provider';

type SessionCountdownProps = {
  seconds: number;
  exerciseName?: string;
};

export function SessionCountdown({
  seconds,
  exerciseName,
}: SessionCountdownProps) {
  const { colors } = useTheme();

  const scale = useSharedValue(0.72);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = 0.72;
    opacity.value = 0;

    scale.value = withSequence(
      withTiming(1.08, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1, {
        duration: 280,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    opacity.value = withSequence(
      withTiming(1, {
        duration: 180,
      }),
      withTiming(1, {
        duration: 260,
      }),
      withTiming(0.78, {
        duration: 220,
      }),
    );

    void Haptics.impactAsync(
      seconds <= 1
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    );
  }, [
    opacity,
    scale,
    seconds,
  ]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [
        {
          scale: scale.value,
        },
      ],
    }));

  return (
    <SessionScreen>
      <View className="flex-1 items-center justify-center">
        {/* Başlık */}
        <Typography
          variant="body"
          tone="muted"
        >
          Hazırlan
        </Typography>

        {/* Countdown dairesi */}
        <View className="mt-lg h-48 w-48 items-center justify-center">
          <View
            className="absolute h-48 w-48 rounded-full"
            style={{
              backgroundColor: colors.primary,
              opacity: 0.05,
            }}
          />

          <View
            className="absolute h-36 w-36 rounded-full"
            style={{
              backgroundColor: colors.primary,
              opacity: 0.08,
            }}
          />

          <Animated.View
            style={animatedStyle}
            className="h-28 w-28 items-center justify-center rounded-full border border-border bg-surface"
          >
            <Typography variant="display">
              {seconds}
            </Typography>
          </Animated.View>
        </View>

        {/* Egzersiz bilgisi */}
        <View className="mt-xl items-center px-lg">
          <Typography
            variant="h2"
            className="text-center"
          >
            {exerciseName ?? 'Egzersiz'}
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs text-center"
          >
            Nefesine odaklan ve harekete hazırlan.
          </Typography>
        </View>
      </View>
    </SessionScreen>
  );
}