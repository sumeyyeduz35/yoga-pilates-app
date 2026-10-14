
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type ContinuePracticeCardProps = {
  title: string;
  discipline: string;
  duration: string;
  progress: number;
  onPress?: () => void;
};

export function ContinuePracticeCard({
  title,
  discipline,
  duration,
  progress,
  onPress,
}: ContinuePracticeCardProps) {
  const { colors } = useTheme();
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} programına devam et`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Card variant="elevated" padding="md">
        <View className="flex-row items-center">
          <View
            className="h-24 w-24 overflow-hidden rounded-lg"
            style={{ backgroundColor: colors.border }}
          >
            <Image
              source={require('../../../../assets/exercise-guidance/characters/female-base/side/female-side-neutral-master.png')}
              resizeMode="contain"
              className="h-full w-full"
            />
          </View>

          <View className="ml-md flex-1">
            <Typography variant="h3" numberOfLines={2}>
              {title}
            </Typography>

            <Typography
              variant="caption"
              tone="muted"
              className="mt-xs"
              numberOfLines={2}
            >
              {discipline} · {duration}
            </Typography>

            <Typography variant="caption" tone="primary" className="mt-sm">
              %{normalizedProgress} tamamlandı
            </Typography>
          </View>

          <View className="ml-sm h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Ionicons name="play" size={19} color={colors.background} />
          </View>
        </View>

        <View className="mt-md h-1.5 overflow-hidden rounded-full bg-border">
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${normalizedProgress}%` }}
          />
        </View>
      </Card>
    </Pressable>
  );
}
