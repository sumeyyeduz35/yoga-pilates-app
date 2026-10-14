
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type HomeDisciplineCardProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  accentColor: string;
  onPress?: () => void;
};

function BotanicalLeaves({
  color,
  mirrored = false,
}: {
  color: string;
  mirrored?: boolean;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: -12,
        ...(mirrored ? { right: -12 } : { left: -12 }),
        width: 88,
        height: 88,
        opacity: 0.13,
        transform: mirrored ? [{ scaleX: -1 }] : [],
      }}
    >
      <Svg width={88} height={88} viewBox="0 0 88 88">
        <Path
          d="M32 90 C35 58 33 38 20 12"
          stroke={color}
          strokeWidth={2.5}
          fill="none"
        />
        <Ellipse
          cx={16}
          cy={25}
          rx={12}
          ry={25}
          fill={color}
          transform="rotate(-35 16 25)"
        />
        <Ellipse
          cx={48}
          cy={44}
          rx={12}
          ry={24}
          fill={color}
          transform="rotate(42 48 44)"
        />
        <Ellipse
          cx={14}
          cy={65}
          rx={12}
          ry={23}
          fill={color}
          transform="rotate(-48 14 65)"
        />
      </Svg>
    </View>
  );
}

export function HomeDisciplineCard({
  title,
  description,
  icon,
  backgroundColor,
  accentColor,
  onPress,
}: HomeDisciplineCardProps) {
  const { mode, colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title} disiplinini keşfet`}
      style={({ pressed }) => ({
        flex: 1,
        minWidth: 0,
        height: 104,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor:
          mode === 'dark' ? colors.surface : backgroundColor,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <BotanicalLeaves color={accentColor} />
      <BotanicalLeaves color={accentColor} mirrored />

      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          gap: 6,
        }}
      >
        <Ionicons
          name={icon}
          size={24}
          color={accentColor}
        />

        <View style={{ flex: 1, minWidth: 0 }}>
          <Typography variant="bodySmall" numberOfLines={1}>
            {title}
          </Typography>

          <Typography
            variant="caption"
            tone="muted"
            numberOfLines={3}
            className="mt-xs"
          >
            {description}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
}
