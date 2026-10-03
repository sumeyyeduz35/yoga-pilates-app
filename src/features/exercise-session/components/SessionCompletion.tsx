import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { SessionScreen } from '@/features/exercise-session/components/SessionScreen';
import { useTheme } from '@/providers/theme-provider';

type SessionCompletionProps = {
  completedExerciseCount: number;
  elapsedSeconds: number;
  onReturn: () => void;
};

function formatElapsedTime(
  totalSeconds: number,
) {
  const minutes = Math.floor(
    totalSeconds / 60,
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function SessionCompletion({
  completedExerciseCount,
  elapsedSeconds,
  onReturn,
}: SessionCompletionProps) {
  const { colors } = useTheme();

  const scale = useSharedValue(0.65);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(18);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 120,
    });

    opacity.value = withTiming(1, {
      duration: 450,
      easing: Easing.out(Easing.ease),
    });

    translateY.value = withSequence(
      withTiming(-4, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(0, {
        duration: 260,
        easing: Easing.inOut(Easing.ease),
      }),
    );

    void Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );
  }, [
    opacity,
    scale,
    translateY,
  ]);

  const iconAnimatedStyle =
    useAnimatedStyle(() => ({
      opacity: opacity.value,
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
    <SessionScreen>
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <View className="items-center justify-center">
            <View
              className="absolute h-40 w-40 rounded-full"
              style={{
                backgroundColor:
                  colors.primary,
                opacity: 0.06,
              }}
            />

            <View
              className="absolute h-28 w-28 rounded-full"
              style={{
                backgroundColor:
                  colors.primary,
                opacity: 0.1,
              }}
            />

            <Animated.View
              style={iconAnimatedStyle}
              className="h-24 w-24 items-center justify-center rounded-full bg-surface"
            >
              <Ionicons
                name="checkmark"
                size={52}
                color={colors.primary}
              />
            </Animated.View>
          </View>

          <View className="mt-xl">
            <Typography
              variant="h1"
              className="text-center"
            >
              Seans Tamamlandı
            </Typography>
          </View>

          <Typography
            variant="body"
            tone="muted"
            className="mt-xs text-center"
          >
            Harika iş. Bugünkü pratiğini
            başarıyla tamamladın.
          </Typography>
        </View>

        <View className="mt-2xl w-full">
          <Card
            variant="outlined"
            padding="lg"
          >
            <View className="gap-lg">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-sm">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color={colors.primary}
                  />

                  <Typography
                    variant="body"
                    tone="muted"
                  >
                    Tamamlanan hareket
                  </Typography>
                </View>

                <Typography variant="h3">
                  {completedExerciseCount}
                </Typography>
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-sm">
                  <Ionicons
                    name="time-outline"
                    size={22}
                    color={colors.primary}
                  />

                  <Typography
                    variant="body"
                    tone="muted"
                  >
                    Toplam süre
                  </Typography>
                </View>

                <Typography variant="h3">
                  {formatElapsedTime(
                    elapsedSeconds,
                  )}
                </Typography>
              </View>

              <View className="h-px bg-border" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-sm">
                  <Ionicons
                    name="trending-up-outline"
                    size={22}
                    color={colors.primary}
                  />

                  <Typography
                    variant="body"
                    tone="muted"
                  >
                    Program ilerlemesi
                  </Typography>
                </View>

                <Typography variant="h3">
                  %100
                </Typography>
              </View>
            </View>
          </Card>
        </View>
      </View>

      <Button
        label="Programa Dön"
        size="lg"
        fullWidth
        onPress={onReturn}
      />
    </SessionScreen>
  );
}