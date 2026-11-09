import {
  WaterGlassIcon,
  WellnessFlameIcon,
  YogaIcon,
} from '@/components/icons/DisciplineIcons';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { AchievementBadge } from '@/features/tracking/components/AchievementBadge';
import {
  WeeklyActivityChart,
  type ActivityChartItem,
} from '@/features/tracking/components/WeeklyActivityChart';
import {
  ACHIEVEMENTS,
  TOTAL_ACHIEVEMENTS,
} from '@/features/tracking/constants/achievements';
import {
  useWaterGoalQuery,
  useWaterLogsQuery,
} from '@/features/tracking/queries/water-queries';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type IconName = keyof typeof Ionicons.glyphMap;

type ProgressItem = {
  title: string;
  value: string;
  progress: number;
  icon: IconName;
  color: string;
  softColor: string;
};

type QuickAction = {
  title: string;
  subtitle?: string;
  icon: IconName;
  color: string;
  customIcon?: 'waterGlass';
};

const WEEKDAYS = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
];

const MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

type ActivityPeriod = 'week' | 'lastWeek' | 'month' | 'threeMonths';

function formatLocalDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getMonday(date: Date): Date {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function getActivityChartData(
  today: Date,
  period: ActivityPeriod,
): ActivityChartItem[] {
  if (period === 'week' || period === 'lastWeek') {
    const monday = getMonday(today);
    if (period === 'lastWeek') {
      monday.setDate(monday.getDate() - 7);
    }

    return WEEKDAYS.map((label, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return { date: formatLocalDate(date), label, minutes: 0 };
    });
  }

  if (period === 'month') {
    // Haftalar takvimde Pazartesi-Pazar düzeninde gruplanır.
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const firstMonday = getMonday(monthStart);
    const weeks: ActivityChartItem[] = [];

    for (let start = new Date(firstMonday); start <= monthEnd; start.setDate(start.getDate() + 7)) {
      const weekNumber = weeks.length + 1;
      weeks.push({
        date: formatLocalDate(start),
        label: `${weekNumber}. Hafta`,
        minutes: 0,
      });
    }
    return weeks;
  }

  // İçinde bulunulan ay ve ondan önceki iki ay.
  return [2, 1, 0].map((monthsAgo) => {
    const date = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
    return {
      date: formatLocalDate(date),
      label: MONTHS[date.getMonth()],
      minutes: 0,
    };
  });
}


const ACTIVITY_PERIODS: { value: ActivityPeriod; label: string }[] = [
  { value: 'week', label: 'Bu Hafta' },
  { value: 'lastWeek', label: 'Geçen Hafta' },
  { value: 'month', label: 'Bu Ay' },
  { value: 'threeMonths', label: 'Son 3 Ay' },
];

// Geçici değerler. Gerçek veriler daha sonra bağlanacak.
const progressItems: ProgressItem[] = [
  {
    title: 'Su',
    value: '0 / 2.000 ml',
    progress: 0,
    icon: 'water',
    color: '#67ACCD',
    softColor: '#E4F2F9',
  },
  {
    title: 'Beslenme',
    value: '0 / 2.200 kcal',
    progress: 0,
    icon: 'restaurant',
    color: '#E7A17B',
    softColor: '#FAE9DF',
  },
  {
    title: 'Egzersiz',
    value: '0 / 40 dk',
    progress: 0,
    icon: 'fitness-outline',
    color: '#91B19A',
    softColor: '#E6F0E7',
  },
  {
    title: 'Hedefler',
    value: '0 / 0 tamamlandı',
    progress: 0,
    icon: 'stats-chart',
    color: '#AA8CB8',
    softColor: '#F0E8F4',
  },
];

const quickActions: QuickAction[] = [
  {
    title: '+ Su Ekle',
    icon: 'water-outline',
    customIcon: 'waterGlass',
    color: '#67ACCD',
  },
  {
    title: 'Öğün Ekle',
    subtitle: '(Fotoğrafla)',
    icon: 'camera-outline',
    color: '#4F6F64',
  },
  {
    title: 'Aktivite Ekle',
    icon: 'barbell-outline',
    color: '#4F6F64',
  },
  {
    title: 'Diğer Kayıtlar',
    icon: 'add-circle-outline',
    color: '#6E7772',
  },
];

export default function TrackingScreen() {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';

    const { user } = useAuth();
  const userId = user?.id;

  const todayKey = formatLocalDate(new Date());

  const waterLogsQuery = useWaterLogsQuery(
    userId,
    todayKey,
    todayKey,
  );

  const waterGoalQuery = useWaterGoalQuery(userId);

  const dailyWater = (waterLogsQuery.data ?? []).reduce(
    (total, log) => total + log.amount_ml,
    0,
  );

  const dailyWaterGoal =
    waterGoalQuery.data?.daily_goal_ml ?? 2000;

  const waterProgress = Math.round(
    (dailyWater / dailyWaterGoal) * 100,
  );

  const [activityPeriod, setActivityPeriod] =
    useState<ActivityPeriod>('week');
  const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);

  const selectedPeriodLabel =
    ACTIVITY_PERIODS.find((period) => period.value === activityPeriod)?.label ??
    'Bu Hafta';

  const today = useMemo(() => new Date(), []);

  // Haftanın Pazartesi gününü bul.
  const weekDays = useMemo(() => {
    const monday = new Date(today);

    monday.setDate(
      today.getDate() - ((today.getDay() + 6) % 7),
    );

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + index);

      return {
        label: WEEKDAYS[index],
        day: date.getDate(),
        isToday:
          date.toDateString() === today.toDateString(),
        dateKey: formatLocalDate(date),
      };
    });
  }, [today]);

  // Seçilen dönem için gün/hafta/ay etiketleri oluşturulur.
  // Supabase bağlı olmadığı için egzersiz süreleri şimdilik sıfırdır.
  const activityChartData = useMemo(
    () => getActivityChartData(today, activityPeriod),
    [today, activityPeriod],
  );

  const activityTitle =
    activityPeriod === 'month'
      ? 'Bu Aydaki Aktiviten'
      : activityPeriod === 'threeMonths'
        ? 'Son 3 Aylık Aktiviten'
        : activityPeriod === 'lastWeek'
          ? 'Geçen Haftaki Aktiviten'
          : 'Bu Haftaki Aktiviten';

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-md pb-2xl pt-md"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="mb-md flex-row items-center justify-between">
        <View className="flex-1 pr-sm">
          <Typography variant="h1">
            Takip
          </Typography>

          <Typography
            variant="caption"
            tone="muted"
            className="mt-xs"
          >
            Günlük alışkanlıklarını takip et, gelişimini gör.
          </Typography>
        </View>

        <View
          className="h-11 w-11 items-center justify-center rounded-full border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={colors.text}
          />
        </View>
      </View>

      {/* Weekly date strip */}
      <View className="mb-md flex-row items-center gap-xs">
        <View
          className="items-center justify-center"
          style={{
            height: 48,
            minWidth: 62,
            paddingHorizontal: 8,
            borderRadius: 14,
            backgroundColor: colors.primary,
          }}
        >
          <Typography
            variant="caption"
            style={{
              color: isDark
                ? colors.background
                : '#FFFFFF',
              fontFamily: 'Manrope_600SemiBold',
              fontSize: 11,
            }}
          >
            Bugün
          </Typography>
        </View>

        <View className="flex-1 flex-row gap-xs">
          {weekDays.map((day) => (
            <View
              key={day.dateKey}
              className="flex-1 items-center justify-center"
              style={{
                height: 48,
                minWidth: 0,
                borderRadius: 11,
                borderWidth: 1,
                backgroundColor: day.isToday
                  ? colors.primarySoft
                  : colors.surface,
                borderColor: day.isToday
                  ? colors.primary
                  : colors.border,
              }}
            >
              <Typography
                variant="caption"
                tone={day.isToday ? 'default' : 'muted'}
                style={{
                  fontSize: 9,
                  lineHeight: 14,
                }}
              >
                {day.label}
              </Typography>

              <Typography
                variant="caption"
                style={{
                  fontSize: 12,
                  lineHeight: 17,
                  fontFamily: day.isToday
                    ? 'Manrope_700Bold'
                    : 'Manrope_500Medium',
                }}
              >
                {day.day}
              </Typography>
            </View>
          ))}
        </View>
      </View>

      {/* Daily streak */}
      <Card
        padding="md"
        className="mb-lg"
        style={{
          borderRadius: 16,
          backgroundColor: isDark
            ? '#40372F'
            : '#F9EFE5',
        }}
      >
        <View className="flex-row items-center gap-md">
          <View
            className="h-12 w-12 items-center justify-center rounded-xl"
            style={{
              backgroundColor: isDark
                ? '#594335'
                : '#FFF3E4',
            }}
          >
            <WellnessFlameIcon size={30} />
          </View>

          <View className="flex-1">
            <Typography variant="h3">
              Günlük Seri
            </Typography>

            <Typography
              variant="caption"
              tone="muted"
            >
              İlk serini oluşturmaya başla.
            </Typography>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text}
          />
        </View>
      </Card>

      {/* Daily progress */}
      <Typography
        variant="h2"
        className="mb-sm"
      >
        Günlük İlerleme
      </Typography>

      <View className="mb-lg flex-row flex-wrap justify-between gap-y-sm">
        {progressItems.map((item) => (
          <View
            key={item.title}
            style={{ width: '49%' }}
          >
            <Card
              padding="sm"
              variant="outlined"
              style={{
                borderRadius: 14,
                minHeight: 89,
                justifyContent: 'center',
              }}
            >
              <View className="flex-row items-center gap-sm">
                <View
                  className="items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: isDark
                      ? colors.surfaceMuted
                      : item.softColor,
                  }}
                >
                  {item.title === 'Egzersiz' ? (
                    <YogaIcon
                      size={25}
                      color={item.color}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.color}
                    />
                  )}
                </View>

                <View className="flex-1">
                  <Typography
                    variant="label"
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      lineHeight: 17,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                    style={{
                      fontSize: 10,
                      lineHeight: 15,
                    }}
                  >
                    {item.title === 'Su'
  ? waterLogsQuery.isLoading || waterGoalQuery.isLoading
    ? 'Yükleniyor...'
    : waterLogsQuery.isError || waterGoalQuery.isError
      ? 'Veri alınamadı'
      : `${dailyWater.toLocaleString('tr-TR')} / ${dailyWaterGoal.toLocaleString('tr-TR')} ml`
  : item.value}
                  </Typography>
                </View>
              </View>

              {/* Progress bar */}
              <View className="mt-sm flex-row items-center gap-sm">
                <View
                  className="flex-1 overflow-hidden rounded-full"
                  style={{
                    height: 6,
                    backgroundColor: isDark
                      ? colors.surfaceMuted
                      : item.softColor,
                  }}
                >
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(
  100,
  Math.max(
    0,
    item.title === 'Su'
      ? waterProgress
      : item.progress,
  ),
)}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </View>

                <Typography
                  variant="caption"
                  tone="muted"
                  style={{
                    fontSize: 10,
                    minWidth: 24,
                    textAlign: 'right',
                  }}
                >
                  %{item.title === 'Su' ? waterProgress : item.progress}
                </Typography>
              </View>
            </Card>
          </View>
        ))}
      </View>

      {/* Quick records */}
      <Typography
        variant="h2"
        className="mb-sm"
      >
        Hızlı Kayıt
      </Typography>

      <View className="flex-row gap-sm">
        {quickActions.map((action) => (
          <Pressable
            key={action.title}
  accessibilityRole="button"
  accessibilityLabel={action.title}
  disabled={action.title !== '+ Su Ekle'}
  onPress={() => {
    if (action.title === '+ Su Ekle') {
      router.push('/tracking/water');
    }
  }}
  className="flex-1"

          >
            <Card
              padding="sm"
              variant="outlined"
              style={{
                minHeight: 90,
                borderRadius: 13,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {action.customIcon === 'waterGlass' ? (
                  <WaterGlassIcon
                    size={29}
                    color={action.color}
                  />
                ) : (
                  <Ionicons
                    name={action.icon}
                    size={25}
                    color={
                      isDark
                        ? colors.textMuted
                        : action.color
                    }
                  />
                )}
              </View>

              <Typography
                variant="caption"
                className="mt-xs text-center"
                style={{
                  fontSize: 10,
                  lineHeight: 14,
                }}
              >
                {action.title}
              </Typography>

              {action.subtitle && (
                <Typography
                  variant="caption"
                  tone="muted"
                  className="text-center"
                  style={{
                    fontSize: 9,
                    lineHeight: 12,
                  }}
                >
                  {action.subtitle}
                </Typography>
              )}
            </Card>
          </Pressable>
        ))}
      </View>

      {/* Weekly activity */}
      <View className="mt-lg">
        <View className="mb-md flex-row items-center justify-between">
          <Typography variant="h2" className="flex-1">
            {activityTitle}
          </Typography>

          <Pressable
            onPress={() => setIsPeriodMenuOpen((previous) => !previous)}
            accessibilityRole="button"
            accessibilityLabel="Aktivite dönemi seç"
            accessibilityState={{ expanded: isPeriodMenuOpen }}
            className="flex-row items-center gap-xs rounded-lg px-sm py-sm"
            style={{ backgroundColor: colors.surface }}
          >
            <Typography variant="caption" tone="muted">
              {selectedPeriodLabel}
            </Typography>

            <Ionicons
              name={isPeriodMenuOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.textMuted}
            />
          </Pressable>
        </View>

        {isPeriodMenuOpen && (
          <Card padding="sm" variant="outlined" className="mb-sm">
            {ACTIVITY_PERIODS.map((period) => (
              <Pressable
                key={period.value}
                onPress={() => {
                  setActivityPeriod(period.value);
                  setIsPeriodMenuOpen(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: activityPeriod === period.value }}
                className="flex-row items-center justify-between rounded-lg px-md py-sm"
                style={{
                  backgroundColor:
                    activityPeriod === period.value
                      ? colors.primarySoft
                      : colors.surface,
                }}
              >
                <Typography variant="bodySmall">{period.label}</Typography>
                {activityPeriod === period.value && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </Card>
        )}

        <Card
          padding="md"
          variant="outlined"
          style={{
            borderRadius: 16,
          }}
        >
          <WeeklyActivityChart
            data={activityChartData}
          />

          <Typography
            variant="caption"
            tone="muted"
            className="mt-md text-center"
          >
            Egzersiz kayıtların burada görüntülenecek.
          </Typography>
        </Card>
      </View>

      {/* Achievements */}
      <View className="mt-lg">
        <View className="mb-md flex-row items-center justify-between">
          <View className="flex-1">
            <Typography variant="h2">Başarıların</Typography>
            <Typography variant="caption" tone="muted">
              0 / {TOTAL_ACHIEVEMENTS} kazanıldı
            </Typography>
          </View>

          <Pressable
            onPress={() => router.push('/tracking/achievements')}
            accessibilityRole="button"
            accessibilityLabel="Tüm başarıları gör"
            className="flex-row items-center gap-xs rounded-lg px-sm py-sm"
          >
            <Typography variant="caption" tone="primary">
              Tümünü Gör
            </Typography>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <View className="flex-row gap-sm">
          {ACHIEVEMENTS.filter((achievement) =>
            ['first-step', 'seven-day-streak', 'water-friend'].includes(
              achievement.id,
            ),
          ).map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon as IconName}
              color={achievement.color}
              backgroundColor={achievement.backgroundColor}
              unlocked={false}
            />
          ))}
        </View>
      </View>

    </ScrollView>
  );
}
