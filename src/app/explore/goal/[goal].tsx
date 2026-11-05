
import { Ionicons } from '@expo/vector-icons';
import {
    Stack,
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    useDisciplinesQuery,
    useExerciseCategoriesQuery,
    useExercisesQuery,
} from '@/features/content/queries/content-queries';
import {
    EXPLORE_GOALS,
} from '@/features/explore/constants/explore-goals';
import { useTheme } from '@/providers/theme-provider';

function getDurationLabel(seconds: number | null) {
  if (seconds == null) {
    return 'Süre belirtilmedi';
  }

  if (seconds < 60) {
    return `${seconds} sn`;
  }

  return `${Math.ceil(seconds / 60)} dk`;
}

function getDifficultyLabel(value: string) {
  switch (value) {
    case 'beginner':
      return 'Başlangıç';
    case 'intermediate':
      return 'Orta';
    case 'advanced':
      return 'İleri';
    default:
      return value;
  }
}

export default function GoalExploreScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const { goal: goalSlug } =
    useLocalSearchParams<{ goal: string }>();

  const selectedGoal = EXPLORE_GOALS.find(
    (item) => item.key === goalSlug,
  );

  // Disiplinleri getir
  const disciplinesQuery = useDisciplinesQuery();

  const disciplines = disciplinesQuery.data ?? [];

  const yoga = disciplines.find(
    (item) => item.slug === 'yoga',
  );

  const pilates = disciplines.find(
    (item) => item.slug === 'pilates',
  );

  const reformer = disciplines.find(
    (item) => item.slug === 'reformer',
  );

  // Egzersiz sorguları
  const yogaExercisesQuery = useExercisesQuery(yoga?.id);
  const pilatesExercisesQuery = useExercisesQuery(pilates?.id);
  const reformerExercisesQuery = useExercisesQuery(reformer?.id);

  // Kategori sorguları
  const yogaCategoriesQuery =
    useExerciseCategoriesQuery(yoga?.id);

  const pilatesCategoriesQuery =
    useExerciseCategoriesQuery(pilates?.id);

  const reformerCategoriesQuery =
    useExerciseCategoriesQuery(reformer?.id);

  const isLoading =
    disciplinesQuery.isPending ||
    yogaExercisesQuery.isPending ||
    pilatesExercisesQuery.isPending ||
    reformerExercisesQuery.isPending ||
    yogaCategoriesQuery.isPending ||
    pilatesCategoriesQuery.isPending ||
    reformerCategoriesQuery.isPending;

  const isError =
    disciplinesQuery.isError ||
    yogaExercisesQuery.isError ||
    pilatesExercisesQuery.isError ||
    reformerExercisesQuery.isError ||
    yogaCategoriesQuery.isError ||
    pilatesCategoriesQuery.isError ||
    reformerCategoriesQuery.isError;

  const exercises = [
    ...(yogaExercisesQuery.data ?? []),
    ...(pilatesExercisesQuery.data ?? []),
    ...(reformerExercisesQuery.data ?? []),
  ];

  const categories = [
    ...(yogaCategoriesQuery.data ?? []),
    ...(pilatesCategoriesQuery.data ?? []),
    ...(reformerCategoriesQuery.data ?? []),
  ];

  const categoryById = new Map(
    categories.map((category) => [
      category.id,
      category,
    ]),
  );

  const disciplineById = new Map(
    disciplines.map((discipline) => [
      discipline.id,
      discipline,
    ]),
  );

  // Seçilen hedefle eşleşen aktif egzersizleri filtrele
  const matchingExercises = selectedGoal
    ? exercises.filter((exercise) => {
        if (!exercise.isActive || !exercise.categoryId) {
          return false;
        }

        const category = categoryById.get(
          exercise.categoryId,
        );

        const discipline = disciplineById.get(
          exercise.disciplineId,
        );

        return (
          Boolean(category?.isActive) &&
          Boolean(discipline?.isActive) &&
          selectedGoal.categorySlugs.includes(
            category?.slug ?? '',
          )
        );
      })
    : [];

  return (
    <>
      <Stack.Screen
        options={{ headerShown: false }}
      />

      <SafeAreaView
        edges={['top', 'bottom']}
        className="flex-1 bg-background"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-lg pb-2xl pt-md"
          showsVerticalScrollIndicator={false}
        >
          {/* GERİ DÖNÜŞ */}
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Keşfet ekranına geri dön"
            className="mb-lg flex-row items-center gap-sm"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />

            <Text
              className="text-sm font-medium"
              style={{ color: colors.text }}
            >
              Keşfet
            </Text>
          </Pressable>

          {/* GEÇERSİZ HEDEF */}
          {!selectedGoal ? (
            <View className="items-center py-2xl">
              <Ionicons
                name="search-outline"
                size={42}
                color={colors.textMuted}
              />

              <Text
                className="mt-md text-lg font-semibold"
                style={{ color: colors.text }}
              >
                Hedef bulunamadı
              </Text>
            </View>
          ) : (
            <>
              {/* HEDEF ÜST KARTI */}
              <View
                style={{
                  backgroundColor:
                    selectedGoal.backgroundColor,
                  borderRadius: 24,
                  padding: 24,
                  minHeight: 185,
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: '#FFFFFFB8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Ionicons
                    name={selectedGoal.icon}
                    size={28}
                    color={selectedGoal.iconColor}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    letterSpacing: 1.2,
                    color: selectedGoal.iconColor,
                    marginBottom: 8,
                  }}
                >
                  HEDEFİNE GÖRE KEŞFET
                </Text>

                <Text
                  style={{
                    fontSize: 26,
                    lineHeight: 34,
                    fontWeight: '700',
                    color: '#29362D',
                    marginBottom: 8,
                  }}
                >
                  {selectedGoal.title}
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    lineHeight: 20,
                    color: '#596259',
                  }}
                >
                  {selectedGoal.description}
                </Text>
              </View>

              {/* YÜKLENME */}
              {isLoading ? (
                <View className="items-center py-2xl">
                  <ActivityIndicator
                    size="large"
                    color={colors.primary}
                  />

                  <Text
                    className="mt-md text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Egzersizler yükleniyor...
                  </Text>
                </View>
              ) : isError ? (
                <View className="items-center py-2xl">
                  <Ionicons
                    name="alert-circle-outline"
                    size={38}
                    color={colors.textMuted}
                  />

                  <Text
                    className="mt-md text-center text-base"
                    style={{ color: colors.text }}
                  >
                    Egzersizler yüklenemedi.
                    Lütfen tekrar dene.
                  </Text>
                </View>
              ) : (
                <>
                  {/* SONUÇ BAŞLIĞI */}
                  <View className="mt-xl mb-md">
                    <Text
                      className="text-xl font-semibold"
                      style={{ color: colors.text }}
                    >
                      Hedefine Uygun Egzersizler
                    </Text>

                    <Text
                      className="mt-xs text-sm"
                      style={{ color: colors.textMuted }}
                    >
                      {matchingExercises.length} egzersiz bulundu
                    </Text>
                  </View>

                  {/* BOŞ DURUM */}
                  {matchingExercises.length === 0 ? (
                    <View className="items-center rounded-2xl border border-border bg-surface px-lg py-2xl">
                      <Ionicons
                        name="leaf-outline"
                        size={36}
                        color={colors.textMuted}
                      />

                      <Text
                        className="mt-md text-center text-base font-semibold"
                        style={{ color: colors.text }}
                      >
                        Henüz uygun egzersiz bulunmuyor
                      </Text>

                      <Text
                        className="mt-sm text-center text-sm"
                        style={{
                          color: colors.textMuted,
                          lineHeight: 21,
                        }}
                      >
                        Bu hedefe uygun yeni pratikler
                        eklendiğinde burada görünecek.
                      </Text>
                    </View>
                  ) : (
                    <View className="gap-md">
                      {matchingExercises.map((exercise) => {
                        const discipline =
                          disciplineById.get(
                            exercise.disciplineId,
                          );

                        return (
                          <Pressable
                            key={exercise.id}
                            onPress={() =>
                              router.push({
                                pathname: '/exercise/[slug]',
                                params: {
                                  slug: exercise.slug,
                                },
                              })
                            }
                            accessibilityRole="button"
                            accessibilityLabel={`${exercise.name} detayını aç`}
                            className="rounded-2xl border border-border bg-surface p-lg"
                          >
                            <View className="flex-row items-start justify-between gap-md">
                              <View className="flex-1">
                                <Text
                                  className="text-base font-semibold"
                                  style={{ color: colors.text }}
                                >
                                  {exercise.name}
                                </Text>

                                <Text
                                  className="mt-xs text-xs"
                                  style={{
                                    color: colors.textMuted,
                                  }}
                                >
                                  {discipline?.name ?? 'Egzersiz'}
                                  {' · '}
                                  {getDifficultyLabel(
                                    exercise.difficulty,
                                  )}
                                  {' · '}
                                  {getDurationLabel(
                                    exercise.durationSeconds,
                                  )}
                                </Text>

                                {exercise.description ? (
                                  <Text
                                    className="mt-sm text-sm"
                                    numberOfLines={2}
                                    style={{
                                      color: colors.textMuted,
                                      lineHeight: 20,
                                    }}
                                  >
                                    {exercise.description}
                                  </Text>
                                ) : null}
                              </View>

                              <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.textMuted}
                              />
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
