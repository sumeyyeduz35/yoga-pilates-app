import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type ExerciseVisualProps = {
  exerciseName: string;
  isPaused?: boolean;
};

export function ExerciseVisual({
  exerciseName,
  isPaused = false,
}: ExerciseVisualProps) {
  const { colors } = useTheme();

  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isPaused) {
      scale.value = withTiming(1, {
        duration: 250,
      });

      translateY.value = withTiming(0, {
        duration: 250,
      });

      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.ease,
          ),
        }),
        withTiming(1, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.ease,
          ),
        }),
      ),
      -1,
      true,
    );

    translateY.value = withRepeat(
      withSequence(
        withTiming(-5, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.ease,
          ),
        }),
        withTiming(0, {
          duration: 1600,
          easing: Easing.inOut(
            Easing.ease,
          ),
        }),
      ),
      -1,
      true,
    );
  }, [
    isPaused,
    scale,
    translateY,
  ]);

  const animatedStyle =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale: scale.value,
        },
        {
          translateY:
            translateY.value,
        },
      ],
    }));

  return (
    <View className="items-center">
      <View className="h-64 w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface">
        <View
          className="absolute h-40 w-40 rounded-full"
          style={{
            backgroundColor:
              colors.primary,
            opacity: 0.08,
          }}
        />

        <View
          className="absolute h-28 w-28 rounded-full"
          style={{
            backgroundColor:
              colors.primary,
            opacity: 0.08,
          }}
        />

        <Animated.View
          style={animatedStyle}
          className="h-28 w-28 items-center justify-center rounded-full bg-background"
        >
          <Ionicons
            name={
              isPaused
                ? 'pause'
                : 'body-outline'
            }
            size={58}
            color={colors.primary}
          />
        </Animated.View>

        <View className="absolute bottom-4 rounded-full border border-border bg-background px-md py-xs">
          <Typography
            variant="caption"
            tone="muted"
          >
            {isPaused
              ? 'Egzersiz duraklatıldı'
              : 'Hareket alanı'}
          </Typography>
        </View>
      </View>

      <View className="mt-md">
        <Typography
          variant="h2"
          className="text-center"
        >
          {exerciseName}
        </Typography>
      </View>
    </View>
  );
}