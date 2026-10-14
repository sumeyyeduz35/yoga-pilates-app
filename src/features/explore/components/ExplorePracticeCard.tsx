
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { Card, type CardDiscipline } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type ExplorePracticeCardProps = {
  title: string;
  description: string;
  discipline: CardDiscipline;
  disciplineLabel: string;
  duration: string;
  level: string;
  onPress?: () => void;
};

export function ExplorePracticeCard({
  title,
  description,
  discipline,
  disciplineLabel,
  duration,
  level,
  onPress,
}: ExplorePracticeCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => ({
        opacity: pressed && onPress ? 0.85 : 1,
      })}
    >
      <Card discipline={discipline} padding="lg">
        {/* Card Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-md">
            <Typography variant="caption" tone="muted">
              {disciplineLabel}
            </Typography>

            <View className="mt-xs">
              <Typography variant="h3">
                {title}
              </Typography>
            </View>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-full bg-surface">
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.text}
            />
          </View>
        </View>

        {/* Description */}
        <View className="mt-sm">
          <Typography variant="body" tone="muted">
            {description}
          </Typography>
        </View>

        {/* Exercise Metadata */}
        <View className="mt-md flex-row flex-wrap items-center gap-x-lg gap-y-sm">
          <View className="flex-row shrink-0 items-center gap-xs">
            <Ionicons
              name="time-outline"
              size={15}
              color={colors.textMuted}
            />

            <View className="shrink-0">
              <Typography variant="caption" tone="muted">
                {duration.replace(/ /g, '\u00A0')}
              </Typography>
            </View>
          </View>

          <View className="flex-row shrink-0 items-center gap-xs">
            <Ionicons
              name="fitness-outline"
              size={15}
              color={colors.textMuted}
            />

            <View className="shrink-0">
              <Typography variant="caption" tone="muted">
                {level}
              </Typography>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
