
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type FeaturedPracticeCardProps = {
  title: string;
  description: string;
  duration: string;
  level?: string;
  badgeLabel?: string;
  ctaLabel?: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
};

export function FeaturedPracticeCard({
  title,
  description,
  duration,
  level,
  badgeLabel = 'Öne Çıkan',
  ctaLabel = 'Hemen Başla',
  imageSource,
  onPress,
}: FeaturedPracticeCardProps) {
  const { colors, mode } = useTheme();

  const fallbackBackground =
    mode === 'dark' ? colors.surface : '#EAE3D6';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}, ${duration}`}
      style={({ pressed }) => ({
        height: 176,
        borderRadius: 28,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: fallbackBackground,
        opacity: pressed && onPress ? 0.94 : 1,
      })}
    >
      {/* Background image */}
      {imageSource ? (
        <Image
          source={imageSource}
          resizeMode="cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      ) : null}

      {/* Soft overlay */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor:
            mode === 'dark'
              ? 'rgba(20,24,22,0.10)'
              : 'rgba(255,250,244,0.08)',
        }}
      />

      {/* Top badges */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingTop: 10,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 999,
            backgroundColor: '#F7E5CC',
            paddingHorizontal: 10,
            paddingVertical: 6,
            gap: 5,
          }}
        >
          <Ionicons
            name="star"
            size={12}
            color="#A8752A"
          />

          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Manrope_500Medium',
              fontSize: 11,
              color: '#28362F',
              includeFontPadding: false,
            }}
          >
            {badgeLabel}
          </Text>
        </View>

        {/* Duration always on one line */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 0,
            gap: 5,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.94)',
            paddingHorizontal: 10,
            paddingVertical: 7,
          }}
        >
          <Ionicons
            name="time-outline"
            size={13}
            color="#28362F"
          />

          <Text
            numberOfLines={1}
            style={{
              fontFamily: 'Manrope_600SemiBold',
              fontSize: 11,
              color: '#28362F',
              includeFontPadding: false,
              flexShrink: 0,
            }}
          >
            {duration.replace(/\s+/g, '\u00A0')}
          </Text>
        </View>
      </View>

      {/* Main content */}
      <View
        style={{
          flex: 1,
          width: '59%',
          paddingHorizontal: 12,
          paddingTop: 6,
          paddingBottom: 12,
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Typography
            variant="h3"
            numberOfLines={2}
            style={{
              fontSize: 17,
              lineHeight: 21,
              color:
                mode === 'dark'
                  ? colors.text
                  : '#21312B',
            }}
          >
            {title}
          </Typography>

          <View style={{ marginTop: 5 }}>
            <Typography
              variant="caption"
              numberOfLines={2}
              style={{
                fontSize: 10,
                lineHeight: 14,
                color:
                  mode === 'dark'
                    ? colors.textMuted
                    : '#4C5A53',
              }}
            >
              {description}
            </Typography>
          </View>
        </View>

        {/* CTA with spacing from description */}
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderRadius: 999,
            backgroundColor: colors.primary,
            paddingHorizontal: 14,
            paddingVertical: 8,
            marginTop: 10,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: '#FFFFFF',
              fontFamily: 'Manrope_600SemiBold',
              fontSize: 12,
              includeFontPadding: false,
            }}
          >
            {ctaLabel}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={14}
            color="#FFFFFF"
          />
        </View>
      </View>
    </Pressable>
  );
}
