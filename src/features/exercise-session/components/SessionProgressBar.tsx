import { useEffect } from 'react';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';

import { useTheme } from '@/providers/theme-provider';

type SessionProgressBarProps = {
  progress: number;
};

const AnimatedRect =
  Animated.createAnimatedComponent(Rect);

export function SessionProgressBar({
  progress,
}: SessionProgressBarProps) {
  const { colors } = useTheme();

  const animatedProgress =
    useSharedValue(0);

  useEffect(() => {
    const normalizedProgress =
      Math.min(
        Math.max(progress, 0),
        100,
      );

    animatedProgress.value =
      withTiming(normalizedProgress, {
        duration: 450,
      });
  }, [animatedProgress, progress]);

  const animatedProps =
    useAnimatedProps(() => ({
      width: animatedProgress.value,
    }));

  return (
    <Svg
      width="100%"
      height={8}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
    >
      <Rect
        x={0}
        y={0}
        width={100}
        height={8}
        rx={4}
        fill={colors.border}
      />

      <AnimatedRect
        animatedProps={animatedProps}
        x={0}
        y={0}
        height={8}
        rx={4}
        fill={colors.primary}
      />
    </Svg>
  );
}