
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type GoalCardProps = {
  title: string;
  value?: string;
  target?: string;
  progress?: number;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  accentColor: string;
  trackColor: string;
};

function GoalCard({
  title,
  value,
  target,
  progress,
  icon,
  backgroundColor,
  accentColor,
  trackColor,
}: GoalCardProps) {
  const { mode, colors } = useTheme();

  const hasProgress =
    typeof progress === 'number' &&
    Number.isFinite(progress);

  const normalizedProgress = hasProgress
    ? Math.min(Math.max(progress, 0), 100)
    : 0;

  return (
    <View
      className="min-h-40 flex-1 rounded-xl p-sm"
      style={{
        backgroundColor:
          mode === 'dark' ? colors.surface : backgroundColor,
      }}
    >
      <Ionicons
        name={icon}
        size={23}
        color={accentColor}
      />

      <Typography variant="h3" className="mt-md">
        {value ?? '—'}
      </Typography>

      <Typography
        variant="caption"
        className="mt-xs"
        numberOfLines={2}
      >
        {title}
      </Typography>

      <View
        className="mt-md h-1.5 overflow-hidden rounded-full"
        style={{ backgroundColor: trackColor }}
      >
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: accentColor,
            width: `${normalizedProgress}%`,
          }}
        />
      </View>

      <Typography
        variant="caption"
        tone="muted"
        className="mt-sm"
        numberOfLines={2}
      >
        {target ?? 'Henüz veri yok'}
      </Typography>
    </View>
  );
}

export function DailyGoals() {
  return (
    <View className="mt-xl">
      <Typography variant="h2">
        Bugünkü Hedefler
      </Typography>

      <View className="mt-md flex-row gap-sm">
        <GoalCard
          title="Su tüketimi"
          icon="water-outline"
          backgroundColor="#E5F2F8"
          accentColor="#468BA7"
          trackColor="#C8E2EC"
        />

        <GoalCard
          title="Alınan kalori"
          icon="flame-outline"
          backgroundColor="#FFF0E5"
          accentColor="#CC8756"
          trackColor="#F2D6C2"
        />

        <GoalCard
          title="Egzersiz"
          icon="barbell-outline"
          backgroundColor="#F0EAF8"
          accentColor="#8B74AC"
          trackColor="#DCD0EC"
        />
      </View>
    </View>
  );
}

