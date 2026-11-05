
import { Ionicons } from '@expo/vector-icons';
import {
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    EXPLORE_GOALS,
    type ExploreGoal,
} from '@/features/explore/constants/explore-goals';
import { useTheme } from '@/providers/theme-provider';

type ExploreGoalCardsProps = {
  onGoalPress: (goal: ExploreGoal) => void;
  onSeeAllPress?: () => void;
};

export function ExploreGoalCards({
  onGoalPress,
  onSeeAllPress,
}: ExploreGoalCardsProps) {
  const { colors } = useTheme();

  return (
    <View>
      {/* BÖLÜM BAŞLIĞI */}
      <View className="mb-sm flex-row items-center justify-between px-md">
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
        >
          Hedefine Göre Keşfet
        </Text>

        {onSeeAllPress ? (
          <Pressable
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel="Tüm hedefleri gör"
            className="flex-row items-center"
            hitSlop={10}
          >
            <Text
              className="text-xs"
              style={{ color: colors.textMuted }}
            >
              Tümünü Gör
            </Text>

            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* ALT AÇIKLAMA */}
      <Text
        className="mb-md px-md text-xs"
        style={{ color: colors.textMuted }}
      >
        Bugün hangi hedefe odaklanmak istersin?
      </Text>

      {/* YATAY HEDEF KARTLARI */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          gap: 10,
        }}
      >
        {EXPLORE_GOALS.map((goal) => (
          <Pressable
            key={goal.key}
            onPress={() => onGoalPress(goal)}
            accessibilityRole="button"
            accessibilityLabel={goal.title}
            style={{
              width: 104,
              minHeight: 116,
              borderRadius: 18,
              backgroundColor: goal.backgroundColor,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 8,
              paddingVertical: 12,
              gap: 10,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#FFFFFFB8',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={goal.icon}
                size={23}
                color={goal.iconColor}
              />
            </View>

            <Text
              style={{
                color: '#303B34',
                fontSize: 11,
                fontWeight: '600',
                textAlign: 'center',
                lineHeight: 15,
              }}
              numberOfLines={2}
            >
              {goal.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

