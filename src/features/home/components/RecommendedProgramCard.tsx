
import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    Pressable,
    View,
    type ImageSourcePropType,
} from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type RecommendedProgramCardProps = {
  title: string;
  discipline: string;
  level: string;
  duration: string;
  image?: ImageSourcePropType;
  onPress?: () => void;
};

export function RecommendedProgramCard({
  title,
  discipline,
  level,
  duration,
  image,
  onPress,
}: RecommendedProgramCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} programını görüntüle`}
      className="w-44 overflow-hidden rounded-xl bg-surface"
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View
        className="h-32 items-center justify-center overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        {image ? (
          <Image
            source={image}
            className="h-full w-full"
            resizeMode="contain"
          />
        ) : (
          <Ionicons
            name="leaf-outline"
            size={42}
            color={colors.primary}
          />
        )}
      </View>

      <View className="min-h-28 justify-between p-md">
        <Typography variant="body" numberOfLines={2}>
          {title}
        </Typography>

        <Typography
          variant="caption"
          tone="muted"
          className="mt-xs"
          numberOfLines={2}
        >
          {discipline} · {level}
        </Typography>

        <View className="mt-sm flex-row items-center justify-between">
          <Typography variant="caption" tone="muted">
            {duration}
          </Typography>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.primary}
          />
        </View>
      </View>
    </Pressable>
  );
}
