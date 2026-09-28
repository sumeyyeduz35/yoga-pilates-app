import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type FeaturedPracticeCardProps = {
  title: string;
  description: string;
  duration: string;
  level: string;
  onPress?: () => void;
};

export function FeaturedPracticeCard({
  title,
  description,
  duration,
  level,
  onPress,
}: FeaturedPracticeCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Card discipline="yoga" padding="lg">
        <View className="flex-row items-start justify-between">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-surface">
            <Ionicons name="sunny-outline" size={22} color={colors.text} />
          </View>

          <View className="rounded-full bg-surface px-md py-sm">
            <Typography variant="caption">Bugün</Typography>
          </View>
        </View>

        <View className="mt-xl">
          <Typography variant="h2">{title}</Typography>

          <View className="mt-sm">
            <Typography variant="body" tone="muted">
              {description}
            </Typography>
          </View>
        </View>

        <View className="mt-lg flex-row items-center justify-between">
          <View className="flex-row items-center gap-md">
            <View className="flex-row items-center gap-xs">
              <Ionicons name="time-outline" size={16} color={colors.textMuted} />
              <Typography variant="caption" tone="muted">
                {duration}
              </Typography>
            </View>

            <View className="flex-row items-center gap-xs">
              <Ionicons name="leaf-outline" size={16} color={colors.textMuted} />
              <Typography variant="caption" tone="muted">
                {level}
              </Typography>
            </View>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Ionicons name="arrow-forward" size={19} color={colors.background} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
