import { ScrollView, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { AchievementBadge } from '@/features/tracking/components/AchievementBadge';
import {
    ACHIEVEMENTS,
    TOTAL_ACHIEVEMENTS,
    type AchievementCategory,
} from '@/features/tracking/constants/achievements';
import { useTheme } from '@/providers/theme-provider';

import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Ionicons>['name'];

const CATEGORIES: {
  title: string;
  categories: AchievementCategory[];
}[] = [
  {
    title: 'Başlangıç ve Düzenlilik',
    categories: ['beginner', 'streak'],
  },
  {
    title: 'Yoga, Pilates ve Reformer',
    categories: ['yoga', 'pilates', 'reformer'],
  },
  {
    title: 'Egzersiz ve Hedefler',
    categories: ['exercise', 'goals'],
  },
  {
    title: 'Su ve Beslenme',
    categories: ['water', 'nutrition'],
  },
];

export default function AchievementsScreen() {
  const { colors } = useTheme();

  const unlockedCount = 0;
  const progress =
    TOTAL_ACHIEVEMENTS > 0
      ? (unlockedCount / TOTAL_ACHIEVEMENTS) * 100
      : 0;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-md pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >

      <Typography
        variant="bodySmall"
        tone="muted"
        className="mt-xs mb-lg"
      >
        Her küçük adım, yeni bir başarı.
      </Typography>

      {/* Achievement summary */}
      <View
        className="mb-xl rounded-xl p-lg"
        style={{ backgroundColor: colors.surface }}
      >
        <Typography variant="h3">
          Başarı Yolculuğun
        </Typography>

        <Typography variant="h1" className="mt-sm">
          {unlockedCount} / {TOTAL_ACHIEVEMENTS}
        </Typography>

        <Typography variant="caption" tone="muted">
          Rozet kazanıldı
        </Typography>

        <View
          className="mt-md h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: colors.primarySoft }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>

      {/* Categories */}
      {CATEGORIES.map((group) => {
        const achievements = ACHIEVEMENTS.filter(
          (achievement) =>
            group.categories.includes(achievement.category),
        );

        return (
          <View key={group.title} className="mb-xl">
            <View className="mb-md flex-row items-center justify-between">
              <Typography variant="h3">
                {group.title}
              </Typography>

              <Typography variant="caption" tone="muted">
                {achievements.length} rozet
              </Typography>
            </View>

            <View className="flex-row flex-wrap gap-sm">
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={{ width: '31%' }}
                >
                  <AchievementBadge
                    title={achievement.title}
                    description={achievement.description}
                    icon={achievement.icon as IconName}
                    color={achievement.color}
                    backgroundColor={achievement.backgroundColor}
                    unlocked={false}
                  />
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}