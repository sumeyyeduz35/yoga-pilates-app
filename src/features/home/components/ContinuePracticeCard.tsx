import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

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
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Card variant="elevated" padding="lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-md">
            <Typography variant="caption" tone="muted">
              {discipline} · {duration}
            </Typography>

            <View className="mt-xs">
              <Typography variant="h3">{title}</Typography>
            </View>
          </View>

          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Ionicons name="play" size={20} color={colors.background} />
          </View>
        </View>

        <View className="mt-lg">
          <View className="h-2 overflow-hidden rounded-full bg-border">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${normalizedProgress}%` }}
            />
          </View>

          <View className="mt-sm flex-row justify-between">
            <Typography variant="caption" tone="muted">
              İlerlemen
            </Typography>

            <Typography variant="caption" tone="muted">
              %{normalizedProgress}
            </Typography>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
