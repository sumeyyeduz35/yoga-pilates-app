import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type TimerRingProps = {
  remainingSeconds: number;
  totalSeconds: number;
  isPaused?: boolean;
  size?: number;
};

const AnimatedCircle =
  Animated.createAnimatedComponent(Circle);

export function TimerRing({
  remainingSeconds,
  totalSeconds,
  isPaused = false,
  size = 190,
}: TimerRingProps) {
  const { colors } = useTheme();

  const strokeWidth = 10;
  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  const normalizedProgress =
    totalSeconds > 0
      ? Math.min(
          Math.max(
            remainingSeconds / totalSeconds,
            0,
          ),
          1,
        )
      : 0;

  const animatedProgress =
    useSharedValue(normalizedProgress);

  useEffect(() => {
    animatedProgress.value =
      withTiming(normalizedProgress, {
        duration: 350,
      });
  }, [
    animatedProgress,
    normalizedProgress,
  ]);

  const animatedProps =
    useAnimatedProps(() => ({
      strokeDashoffset:
        circumference *
        (1 - animatedProgress.value),
    }));

  const minutes = Math.floor(
    remainingSeconds / 60,
  );

  const seconds =
    remainingSeconds % 60;

  const formattedTime =
    `${minutes}:${seconds
      .toString()
      .padStart(2, '0')}`;

  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          transform: [
            {
              rotate: '-90deg',
            },
          ],
        }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <AnimatedCircle
          animatedProps={animatedProps}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={
            circumference
          }
        />
      </Svg>

      <Typography
        variant="display"
        className="text-center"
      >
        {formattedTime}
      </Typography>

      <View className="mt-xs">
        <Typography
          variant="caption"
          tone="muted"
        >
          {isPaused
            ? 'Duraklatıldı'
            : 'Kalan süre'}
        </Typography>
      </View>
    </View>
  );
}