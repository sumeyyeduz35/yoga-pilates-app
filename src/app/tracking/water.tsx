import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import {
    useAddWaterLogMutation,
    useDeleteWaterLogMutation,
    useUpsertWaterGoalMutation,
    useWaterGoalQuery,
    useWaterLogsQuery,
} from '@/features/tracking/queries/water-queries';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/providers/theme-provider';

const DAILY_GOAL = 2000;
const WATER_COLOR = '#67ACCD';

const QUICK_AMOUNTS = [150, 250, 500];

const WEEKDAYS = [
  'Pzt',
  'Sal',
  'Çar',
  'Per',
  'Cum',
  'Cmt',
  'Paz',
];

function formatLocalDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

const CIRCLE_SIZE = 220;
const CIRCLE_STROKE = 15;
const CIRCLE_RADIUS = (CIRCLE_SIZE - CIRCLE_STROKE) / 2;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function WaterTrackingScreen() {
  const { colors, mode } = useTheme();
  const isDark = mode === 'dark';

  const { user } = useAuth();
  const userId = user?.id;
  const today = new Date();
  const todayKey = formatLocalDate(today);

  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return formatLocalDate(date);
  });

  const waterLogsQuery = useWaterLogsQuery(userId, todayKey, todayKey);
  const weeklyLogsQuery = useWaterLogsQuery(
    userId,
    weekDates[0] ?? todayKey,
    weekDates[6] ?? todayKey,
  );
  const waterGoalQuery = useWaterGoalQuery(userId);
  const addWaterMutation = useAddWaterLogMutation();
  const deleteWaterMutation = useDeleteWaterLogMutation();
  const updateWaterGoalMutation = useUpsertWaterGoalMutation();

  const [customAmount, setCustomAmount] = useState('');
  const [goalInput, setGoalInput] = useState('');
const [isEditingGoal, setIsEditingGoal] = useState(false);
  const currentWater = (waterLogsQuery.data ?? []).reduce(
    (total, log) => total + log.amount_ml,
    0,
  );
  const dailyGoal = waterGoalQuery.data?.daily_goal_ml ?? DAILY_GOAL;
  const progress = Math.min(currentWater / dailyGoal, 1);
  const progressPercent = Math.round((currentWater / dailyGoal) * 100);
  const weeklyTotals = weekDates.map((date) =>
    (weeklyLogsQuery.data ?? [])
      .filter((log) => log.consumed_on === date)
      .reduce((total, log) => total + log.amount_ml, 0),
  );
  const weeklyMax = Math.ceil(
    Math.max(dailyGoal, ...weeklyTotals) / 500,
  ) * 500;
  const weeklyTicks = Array.from(
    { length: 5 },
    (_, index) => Math.round(weeklyMax * (4 - index) / 4),
  );

  const handleSaveWaterGoal = async () => {
  const value = goalInput.trim();

  if (!/^\d+$/.test(value)) {
    Alert.alert('Geçersiz hedef', 'Lütfen geçerli bir miktar gir.');
    return;
  }

  const amount = Number(value);

  if (
    !Number.isSafeInteger(amount) ||
    amount < 250 ||
    amount > 10000
  ) {
    Alert.alert(
      'Geçersiz hedef',
      'Günlük hedef 250 ile 10.000 ml arasında olmalıdır.',
    );
    return;
  }

  if (!userId) {
    Alert.alert('Oturum gerekli', 'Hedefini kaydetmek için giriş yapmalısın.');
    return;
  }

  try {
    await updateWaterGoalMutation.mutateAsync({
      userId,
      dailyGoalMl: amount,
    });

    setIsEditingGoal(false);
    setGoalInput('');
  } catch {
    Alert.alert(
      'Kayıt başarısız',
      'Su hedefin güncellenemedi. Tekrar dene.',
    );
  }
};

  const addWater = async (amount: number): Promise<boolean> => {
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 5000) {
      return false;
    }
    if (!userId) {
      Alert.alert('Oturum gerekli', 'Su kaydetmek için giriş yapmalısın.');
      return false;
    }
    try {
      await addWaterMutation.mutateAsync({
        userId,
        amountMl: amount,
        consumedOn: todayKey,
      });
      return true;
    } catch {
      Alert.alert('Kayıt başarısız', 'Su miktarı kaydedilemedi. Tekrar dene.');
      return false;
    }
  };

  const handleDeleteWaterLog = (
  logId: string,
  amountMl: number,
) => {
  if (!userId || deleteWaterMutation.isPending) {
    return;
  }

  Alert.alert(
    'Su Kaydını Sil',
    `${amountMl} ml su kaydını silmek istiyor musun?`,
    [
      {
        text: 'Vazgeç',
        style: 'cancel',
      },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          void deleteWaterMutation
            .mutateAsync({
              userId,
              logId,
            })
            .catch(() => {
              Alert.alert(
                'Silme başarısız',
                'Su kaydı silinemedi. Tekrar dene.',
              );
            });
        },
      },
    ],
  );
};

  const handleCustomAmount = async () => {
    const trimmedAmount = customAmount.trim();

    if (!/^\d+$/.test(trimmedAmount)) {
      return;
    }

    const amount = Number(trimmedAmount);

    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      amount > 5000
    ) {
      return;
    }

    const saved = await addWater(amount);
    if (saved) {
      setCustomAmount('');
    }
  };

  const parsedCustomAmount = /^\d+$/.test(
    customAmount.trim(),
  )
    ? Number(customAmount.trim())
    : 0;

  const isCustomAmountValid =
    Number.isSafeInteger(parsedCustomAmount) &&
    parsedCustomAmount > 0 &&
    parsedCustomAmount <= 5000;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-md pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Introduction */}
      <View className="mb-xl flex-row items-center justify-between">
        <View className="flex-1">
          <Typography variant="h1">
            Su Takibi
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs"
          >
            Günlük su tüketimini takip et.
          </Typography>
        </View>

        <View
          className="h-12 w-12 items-center justify-center rounded-xl"
          style={{
            backgroundColor: isDark
              ? colors.surfaceMuted
              : '#E4F2F9',
          }}
        >
          <Ionicons
            name="water-outline"
            size={25}
            color={WATER_COLOR}
          />
        </View>
      </View>

      {/* Circular progress */}
      <Card padding="lg" className="mb-lg">
        <View className="items-center">
          <View
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg
              width={CIRCLE_SIZE}
              height={CIRCLE_SIZE}
              viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
              style={{
                position: 'absolute',
                transform: [{ rotate: '-90deg' }],
              }}
            >
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={
                  isDark
                    ? colors.surfaceMuted
                    : '#E4EDF0'
                }
                strokeWidth={CIRCLE_STROKE}
                fill="none"
              />

              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={CIRCLE_RADIUS}
                stroke={WATER_COLOR}
                strokeWidth={CIRCLE_STROKE}
                strokeLinecap="round"
                strokeDasharray={`${CIRCLE_CIRCUMFERENCE}`}
                strokeDashoffset={
                  CIRCLE_CIRCUMFERENCE * (1 - progress)
                }
                fill="none"
              />
            </Svg>

            <View className="items-center">
              <Ionicons
                name="water"
                size={27}
                color={WATER_COLOR}
              />

              <Typography
                variant="display"
                className="mt-sm"
              >
                {currentWater.toLocaleString('tr-TR')} ml
              </Typography>

              <Typography
                variant="bodySmall"
                tone="muted"
              >
                / {dailyGoal.toLocaleString('tr-TR')} ml
              </Typography>

              <Typography
                variant="caption"
                tone="muted"
                className="mt-sm"
              >
                %{progressPercent} tamamlandı
              </Typography>
            </View>
          </View>
        </View>
      </Card>

      {waterLogsQuery.isLoading && (
        <Typography variant="caption" tone="muted" className="mb-sm text-center">
          Su kayıtları yükleniyor...
        </Typography>
      )}
      {(waterLogsQuery.isError || waterGoalQuery.isError) && (
        <Typography variant="caption" className="mb-sm text-center" style={{ color: '#B44D4D' }}>
          Su verileri yüklenemedi. Bağlantını kontrol edip tekrar dene.
        </Typography>
      )}

      
{/* Daily water goal */}
<Card
  padding="md"
  variant="outlined"
  className="mb-lg"
>
  <View className="flex-row items-center justify-between">
    <View className="flex-1">
      <Typography variant="h3">
        Günlük Su Hedefim
      </Typography>

      <Typography
        variant="bodySmall"
        tone="muted"
        className="mt-xs"
      >
        {dailyGoal.toLocaleString('tr-TR')} ml
      </Typography>
    </View>

    <Pressable
      onPress={() => {
        if (isEditingGoal) {
          setIsEditingGoal(false);
          setGoalInput('');
        } else {
          setGoalInput(String(dailyGoal));
          setIsEditingGoal(true);
        }
      }}
      accessibilityRole="button"
      accessibilityLabel={
        isEditingGoal ? 'Düzenlemeyi iptal et' : 'Su hedefini düzenle'
      }
      className="flex-row items-center gap-xs rounded-lg px-sm py-sm"
    >
      <Ionicons
        name={isEditingGoal ? 'close-outline' : 'create-outline'}
        size={19}
        color={colors.primary}
      />

      <Typography variant="caption" tone="primary">
        {isEditingGoal ? 'İptal' : 'Düzenle'}
      </Typography>
    </Pressable>
  </View>

  {isEditingGoal && (
    <View className="mt-md">
      <View className="flex-row items-center gap-sm">
        <View
          className="min-h-12 flex-1 flex-row items-center rounded-xl border px-md"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
          }}
        >
          <TextInput
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="number-pad"
            maxLength={5}
            placeholder="Örn. 2500"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Günlük su hedefi"
            style={{
              flex: 1,
              color: colors.text,
              fontFamily: 'Manrope_500Medium',
              fontSize: 14,
            }}
          />

          <Typography variant="caption" tone="muted">
            ml
          </Typography>
        </View>

        <Pressable
          onPress={() => {
            void handleSaveWaterGoal();
          }}
          disabled={updateWaterGoalMutation.isPending}
          accessibilityRole="button"
          accessibilityLabel="Su hedefini kaydet"
          className="min-h-12 items-center justify-center rounded-xl px-lg"
          style={{
            backgroundColor: updateWaterGoalMutation.isPending
              ? colors.surfaceMuted
              : colors.primary,
          }}
        >
          <Typography
            variant="label"
            style={{
              color: updateWaterGoalMutation.isPending
                ? colors.textMuted
                : '#FFFFFF',
            }}
          >
            {updateWaterGoalMutation.isPending
              ? 'Kaydediliyor'
              : 'Kaydet'}
          </Typography>
        </Pressable>
      </View>

      <Typography
        variant="caption"
        tone="muted"
        className="mt-sm"
      >
        Günlük hedefini 250–10.000 ml arasında belirleyebilirsin.
      </Typography>
    </View>
  )}
</Card>


      {/* Quick water amounts */}
      <Typography variant="h3" className="mb-md">
        Hızlı Su Ekle
      </Typography>

      <View className="mb-sm flex-row gap-sm">
        {QUICK_AMOUNTS.map((amount) => (
          <Pressable
            key={amount}
            onPress={() => { void addWater(amount); }}
            disabled={!userId || addWaterMutation.isPending || waterLogsQuery.isLoading}
            accessibilityRole="button"
            accessibilityLabel={`${amount} mililitre su ekle`}
            className="flex-1"
          >
            <Card
              padding="md"
              variant="outlined"
              className="items-center"
            >
              <Typography
                variant="label"
                style={{ color: colors.primary }}
              >
                +{amount} ml
              </Typography>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* Custom water amount */}
      <Card
        padding="md"
        variant="outlined"
        className="mb-xl"
      >
        <View className="mb-md flex-row items-center gap-sm">
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Typography variant="label">
            Özel Miktar Gir
          </Typography>
        </View>

        <View className="flex-row items-center gap-sm">
          <View
            className="min-h-12 flex-1 flex-row items-center rounded-xl border px-md"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <TextInput
              value={customAmount}
              onChangeText={setCustomAmount}
              keyboardType="number-pad"
              placeholder="Örn. 350"
              placeholderTextColor={colors.textMuted}
              maxLength={5}
              accessibilityLabel="Özel su miktarı"
              style={{
                flex: 1,
                minWidth: 0,
                color: colors.text,
                fontFamily: 'Manrope_500Medium',
                fontSize: 14,
              }}
            />

            <Typography variant="caption" tone="muted">
              ml
            </Typography>
          </View>

          <Pressable
            onPress={() => { void handleCustomAmount(); }}
            disabled={!isCustomAmountValid || !userId || addWaterMutation.isPending || waterLogsQuery.isLoading}
            accessibilityRole="button"
            accessibilityLabel="Özel su miktarını ekle"
            accessibilityState={{
              disabled: !isCustomAmountValid || !userId || addWaterMutation.isPending || waterLogsQuery.isLoading,
            }}
            className="min-h-12 items-center justify-center rounded-xl px-lg"
            style={{
              backgroundColor: isCustomAmountValid && userId && !addWaterMutation.isPending
                ? colors.primary
                : colors.surfaceMuted,
            }}
          >
            <Typography
              variant="label"
              style={{
                color: isCustomAmountValid && userId && !addWaterMutation.isPending
                  ? '#FFFFFF'
                  : colors.textMuted,
              }}
            >
              Ekle
            </Typography>
          </Pressable>
        </View>

        <Typography
          variant="caption"
          tone="muted"
          className="mt-sm"
        >
          Tek seferde 1–5.000 ml girebilirsin.
        </Typography>
      </Card>

      {/* Weekly consumption */}
      <View className="mb-md flex-row items-center justify-between">
        <Typography variant="h3">
          Haftalık Su Tüketimi
        </Typography>

        <Typography variant="caption" tone="muted">
          Bu Hafta
        </Typography>
      </View>

      <Card padding="md" variant="outlined">
        <View className="flex-row">
          <View
            style={{
              width: 35,
              height: 155,
              justifyContent: 'space-between',
            }}
          >
            {weeklyTicks.map((value) => (
              <Typography
                key={value}
                variant="caption"
                tone="muted"
                style={{ fontSize: 9 }}
              >
                {value}
              </Typography>
            ))}
          </View>

          <View className="flex-1">
            <Svg
              width="100%"
              height={155}
              viewBox="0 0 320 155"
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <Line
                  key={index}
                  x1={0}
                  x2={320}
                  y1={10 + index * 35}
                  y2={10 + index * 35}
                  stroke={colors.border}
                  strokeDasharray="3 4"
                  strokeWidth={1}
                />
              ))}

              {weeklyTotals.map((amount, index) => {
                const height = (amount / weeklyMax) * 140;

                const x = index * (320 / 7) + 12;

                return (
                  <Rect
                    key={index}
                    x={x}
                    y={150 - height}
                    width={22}
                    height={height}
                    rx={5}
                    fill={WATER_COLOR}
                  />
                );
              })}
            </Svg>
          </View>
        </View>

        <View className="mt-sm flex-row">
          <View style={{ width: 35 }} />

          <View className="flex-1 flex-row">
            {WEEKDAYS.map((day) => (
              <View
                key={day}
                className="flex-1 items-center"
              >
                <Typography
                  variant="caption"
                  tone="muted"
                  style={{ fontSize: 10 }}
                >
                  {day}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <Typography
          variant="caption"
          tone="muted"
          className="mt-lg text-center"
        >
          {weeklyLogsQuery.isLoading
            ? 'Haftalık su kayıtları yükleniyor...'
            : weeklyLogsQuery.isError
              ? 'Haftalık su kayıtları yüklenemedi.'
              : weeklyTotals.every((amount) => amount === 0)
                ? 'Bu hafta henüz su kaydı bulunmuyor.'
                : 'Bu haftanın günlük su tüketimi (ml).'}
        </Typography>
      </Card>
      
      {/* Water record history */}
      <View className="mt-lg">
        <View className="mb-md flex-row items-center justify-between">
          <View>
            <Typography variant="h3">
              Su Kayıtlarım
            </Typography>

            <Typography
              variant="caption"
              tone="muted"
              className="mt-xs"
            >
              Bugünkü su tüketim geçmişin
            </Typography>
          </View>

          <Ionicons
            name="time-outline"
            size={22}
            color={WATER_COLOR}
          />
        </View>

        <Card padding="md" variant="outlined">
          {waterLogsQuery.isLoading ? (
            <Typography
              variant="caption"
              tone="muted"
              className="text-center"
            >
              Su kayıtların yükleniyor...
            </Typography>
          ) : waterLogsQuery.isError ? (
            <Typography
              variant="caption"
              tone="muted"
              className="text-center"
            >
              Su kayıtların yüklenemedi.
            </Typography>
          ) : (waterLogsQuery.data ?? []).length === 0 ? (
            <View className="items-center py-lg">
              <Ionicons
                name="water-outline"
                size={30}
                color={WATER_COLOR}
              />

              <Typography
                variant="bodySmall"
                tone="muted"
                className="mt-sm text-center"
              >
                Bugün henüz su kaydı eklemedin.
              </Typography>
            </View>
          ) : (
            <View>
              {(waterLogsQuery.data ?? []).map((log, index) => (
                <View
                  key={log.id}
                  className="flex-row items-center py-sm"
                  style={{
                    borderBottomWidth:
                      index === (waterLogsQuery.data?.length ?? 0) - 1
                        ? 0
                        : 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View
                    className="mr-md h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: isDark
                        ? colors.surfaceMuted
                        : '#E4F2F9',
                    }}
                  >
                    <Ionicons
                      name="water-outline"
                      size={22}
                      color={WATER_COLOR}
                    />
                  </View>

                  <View className="flex-1">
                    <Typography variant="label">
                      +{log.amount_ml.toLocaleString('tr-TR')} ml
                    </Typography>

                    <Typography
                      variant="caption"
                      tone="muted"
                      className="mt-xs"
                    >
                      {new Date(log.created_at).toLocaleTimeString(
                        'tr-TR',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Typography>
                  </View>

                  <Pressable
                    onPress={() =>
                      handleDeleteWaterLog(log.id, log.amount_ml)
                    }
                    disabled={deleteWaterMutation.isPending}
                    accessibilityRole="button"
                    accessibilityLabel={`${log.amount_ml} mililitre su kaydını sil`}
                    accessibilityState={{
                      disabled: deleteWaterMutation.isPending,
                    }}
                    className="h-10 w-10 items-center justify-center rounded-lg"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={
                        deleteWaterMutation.isPending
                          ? colors.textMuted
                          : '#C57575'
                      }
                    />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </Card>
      </View>

    </ScrollView>
  );
}
