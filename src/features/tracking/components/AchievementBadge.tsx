
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type BadgeIcon = keyof typeof Ionicons.glyphMap;

type AchievementBadgeProps = {
  title: string;
  description: string;
  icon: BadgeIcon;
  color: string;
  backgroundColor: string;
  unlocked?: boolean;
};

export function AchievementBadge({
  title,
  description,
  icon,
  color,
  backgroundColor,
  unlocked = false,
}: AchievementBadgeProps) {
  const { colors, mode } = useTheme();

  return (
    <View
      className="flex-1 items-center rounded-xl border p-sm"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.surface,
        opacity: unlocked ? 1 : 0.8,
      }}
    >
      <View
        className="mb-sm h-14 w-14 items-center justify-center rounded-full"
        style={{
          backgroundColor:
            mode === 'dark' ? colors.surfaceMuted : backgroundColor,
        }}
      >
        <Ionicons
          name={icon}
          size={27}
          color={color}
        />

        {!unlocked && (
          <View
            className="absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.surfaceMuted }}
          >
            <Ionicons
              name="lock-closed"
              size={11}
              color={colors.textMuted}
            />
          </View>
        )}
      </View>

      <Typography
        variant="label"
        numberOfLines={2}
        className="text-center"
        style={{ fontSize: 11 }}
      >
        {title}
      </Typography>

      <Typography
        variant="caption"
        tone="muted"
        numberOfLines={2}
        className="mt-xs text-center"
        style={{ fontSize: 9 }}
      >
        {unlocked ? description : 'Henüz kazanılmadı'}
      </Typography>
    </View>
  );
}
