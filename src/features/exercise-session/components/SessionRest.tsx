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

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { SessionScreen } from '@/features/exercise-session/components/SessionScreen';
import { TimerRing } from '@/features/exercise-session/components/TimerRing';
import { useTheme } from '@/providers/theme-provider';

type SessionRestProps = {
  remainingSeconds: number;
  totalSeconds: number;
  onClose: () => void;
  onSkip: () => void;
};

export function SessionRest({
  remainingSeconds,
  totalSeconds,
  onClose,
  onSkip,
}: SessionRestProps) {
  const { colors } = useTheme();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.08);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.14, {
          duration: 2200,
        }),
        withTiming(0.08, {
          duration: 2200,
        }),
      ),
      -1,
      true,
    );
  }, [
    opacity,
    scale,
  ]);

  const breathingStyle =
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
      {/* Üst alan */}
      <View className="flex-row items-center justify-between">
        <Button
          label="Kapat"
          variant="ghost"
          size="sm"
          onPress={onClose}
        />

        <Typography
          variant="label"
          tone="muted"
        >
          Dinlenme
        </Typography>
      </View>

      {/* Ana içerik */}
      <View className="flex-1 items-center justify-center">
        {/* Küçük nefes animasyonu */}
        <View className="h-36 w-36 items-center justify-center">
          <Animated.View
            style={[
              breathingStyle,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            className="absolute h-28 w-28 rounded-full"
          />

          <View className="h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Ionicons
              name="leaf-outline"
              size={30}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Başlık */}
        <View className="mt-lg items-center px-lg">
          <Typography
            variant="h1"
            className="text-center"
          >
            Dinlenme zamanı
          </Typography>

          <Typography
            variant="body"
            tone="muted"
            className="mt-sm text-center"
          >
            Nefesini yavaşlat ve bir sonraki
            harekete hazırlan.
          </Typography>
        </View>

        {/* Sayaç */}
        <View className="mt-2xl">
          <TimerRing
            remainingSeconds={
              remainingSeconds
            }
            totalSeconds={
              totalSeconds
            }
            size={175}
          />
        </View>
      </View>

      {/* Alt aksiyon */}
      <Button
        label="Dinlenmeyi Geç"
        variant="outline"
        size="lg"
        fullWidth
        onPress={onSkip}
      />
    </SessionScreen>
  );
}