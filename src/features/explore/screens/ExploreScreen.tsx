import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { Typography } from '@/components/ui/Typography';

import {
  useDisciplinesQuery,
  useExerciseCategoriesQuery,
  useExercisesQuery,
} from '@/features/content/queries/content-queries';

import type {
  DisciplineSlug,
  Exercise,
} from '@/features/content/types/content';

import {
  DisciplineCards,
  type ExploreDiscipline,
} from '@/features/explore/components/DisciplineCards';

import { ExploreCollectionsSection } from '@/features/explore/components/ExploreCollectionsSection';
import { ExploreGoalCards } from '@/features/explore/components/ExploreGoalCards';
import { RecommendedExercisesSection } from '@/features/explore/components/RecommendedExercisesSection';
import { FeaturedPracticeCard } from '@/features/home/components/FeaturedPracticeCard';
import { useTheme } from '@/providers/theme-provider';

import { useExerciseCollectionsQuery } from '@/features/explore/queries/collection-queries';
import { getRecommendedExercises } from '@/features/explore/services/recommendation-service';
import { useUserPreferencesQuery } from '@/features/onboarding/queries/onboarding-queries';
import { useAuth } from '@/providers/auth-provider';


type ExploreFilterKey =
  | 'all'
  | DisciplineSlug
  | 'flexibility'
  | 'strength';

const exploreFilters: {
  key: ExploreFilterKey;
  label: string;
}[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'pilates', label: 'Pilates' },
  { key: 'reformer', label: 'Reformer' },
  { key: 'flexibility', label: 'Esneme' },
  { key: 'strength', label: 'Güç' },
];

const flexibilityCategorySlugs = [
  'flexibility',
  'mobility',
];

const strengthCategorySlugs = [
  'core',
  'full-body',
  'upper-body',
  'lower-body',
];

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case 'beginner':
      return 'Başlangıç';

    case 'intermediate':
      return 'Orta';

    case 'advanced':
      return 'İleri';

    default:
      return difficulty;
  }
}

function getDurationLabel(durationSeconds: number | null) {
  if (!durationSeconds) {
    return 'Süre belirtilmedi';
  }

  if (durationSeconds < 60) {
    return `${durationSeconds} sn`;
  }

  return `${Math.ceil(durationSeconds / 60)} dk`;
}

function getDailyFeaturedExercise(
  exercises: Exercise[],
): Exercise | undefined {
  if (exercises.length === 0) {
    return undefined;
  }

  const sortedExercises = [...exercises].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  const today = new Date();

  const dateKey = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  ].join('-');

  const dateSeed = Array.from(dateKey).reduce(
    (total, character) =>
      total + character.charCodeAt(0),
    0,
  );

  return sortedExercises[
    dateSeed % sortedExercises.length
  ];
}

export default function ExploreScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Aktif kullanıcı ve onboarding tercihleri
  const { user } = useAuth();

  const userPreferencesQuery = useUserPreferencesQuery(
    user?.id,
  );

  const [selectedFilter, setSelectedFilter] =
    useState<ExploreFilterKey>('all');

  const [searchQuery, setSearchQuery] = useState('');

  // Supabase disiplin verileri
  const disciplinesQuery = useDisciplinesQuery();
  const collectionsQuery = useExerciseCollectionsQuery();

  const yogaDiscipline = disciplinesQuery.data?.find(
    (discipline) => discipline.slug === 'yoga',
  );

  const pilatesDiscipline = disciplinesQuery.data?.find(
    (discipline) => discipline.slug === 'pilates',
  );

  const reformerDiscipline = disciplinesQuery.data?.find(
    (discipline) => discipline.slug === 'reformer',
  );

  // Disipline göre egzersiz sorguları
  const yogaExercisesQuery =
    useExercisesQuery(yogaDiscipline?.id);

  const pilatesExercisesQuery =
    useExercisesQuery(pilatesDiscipline?.id);

  const reformerExercisesQuery =
    useExercisesQuery(reformerDiscipline?.id);

  // Egzersiz kategorileri
  const yogaCategoriesQuery =
    useExerciseCategoriesQuery(yogaDiscipline?.id);

  const pilatesCategoriesQuery =
    useExerciseCategoriesQuery(pilatesDiscipline?.id);

  const reformerCategoriesQuery =
    useExerciseCategoriesQuery(reformerDiscipline?.id);

  // Tüm egzersizleri birleştir
  const exercises = useMemo(
    () => [
      ...(yogaExercisesQuery.data ?? []),
      ...(pilatesExercisesQuery.data ?? []),
      ...(reformerExercisesQuery.data ?? []),
    ],
    [
      yogaExercisesQuery.data,
      pilatesExercisesQuery.data,
      reformerExercisesQuery.data,
    ],
  );

  // Tüm kategorileri birleştir
  const categories = useMemo(
    () => [
      ...(yogaCategoriesQuery.data ?? []),
      ...(pilatesCategoriesQuery.data ?? []),
      ...(reformerCategoriesQuery.data ?? []),
    ],
    [
      yogaCategoriesQuery.data,
      pilatesCategoriesQuery.data,
      reformerCategoriesQuery.data,
    ],
  );

  // Kullanıcının onboarding tercihlerine göre en fazla 8 öneri.
  const recommendedExercises = useMemo(() => {
    const preferences = userPreferencesQuery.data;
    const disciplines = disciplinesQuery.data;

    if (!preferences || !disciplines) {
      return [];
    }

    return getRecommendedExercises({
      preferences,
      exercises,
      disciplines,
      categories,
      limit: 8,
    });
  }, [
    userPreferencesQuery.data,
    disciplinesQuery.data,
    exercises,
    categories,
  ]);

  const categorySlugById = useMemo(() => {
    return categories.reduce<Record<string, string>>(
      (accumulator, category) => {
        accumulator[category.id] = category.slug;
        return accumulator;
      },
      {},
    );
  }, [categories]);

  // Arama ve hızlı filtreleme
  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLocaleLowerCase('tr-TR');

    return exercises.filter((exercise) => {
      const discipline = disciplinesQuery.data?.find(
        (item) => item.id === exercise.disciplineId,
      );

      const categorySlug = exercise.categoryId
        ? categorySlugById[exercise.categoryId]
        : undefined;

      const matchesSelectedFilter = (() => {
        if (selectedFilter === 'all') {
          return true;
        }

        if (
          selectedFilter === 'yoga' ||
          selectedFilter === 'pilates' ||
          selectedFilter === 'reformer'
        ) {
          return discipline?.slug === selectedFilter;
        }

        if (selectedFilter === 'flexibility') {
          return (
            categorySlug !== undefined &&
            flexibilityCategorySlugs.includes(categorySlug)
          );
        }

        if (selectedFilter === 'strength') {
          return (
            categorySlug !== undefined &&
            strengthCategorySlugs.includes(categorySlug)
          );
        }

        return true;
      })();

      const searchableText = [
        exercise.name,
        exercise.description ?? '',
        discipline?.name ?? '',
        getDifficultyLabel(exercise.difficulty),
      ]
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesSelectedFilter && matchesSearch;
    });
  }, [
    categorySlugById,
    disciplinesQuery.data,
    exercises,
    searchQuery,
    selectedFilter,
  ]);

  // Arama ve filtreler, Tüm Pratikler yerine öneri kartlarını filtreler.
  const visibleRecommendations = useMemo(() => {
    const visibleIds = new Set(filteredExercises.map((item) => item.id));
    return recommendedExercises.filter(({ exercise }) =>
      visibleIds.has(exercise.id),
    );
  }, [filteredExercises, recommendedExercises]);

  // Günlük öne çıkan egzersiz
  const featuredExercise = useMemo(() => {
    if (filteredExercises.length > 0) {
      return getDailyFeaturedExercise(filteredExercises);
    }

    return getDailyFeaturedExercise(exercises);
  }, [exercises, filteredExercises]);

  // Yükleme durumu
  const isLoading =
    disciplinesQuery.isLoading ||
    yogaExercisesQuery.isLoading ||
    pilatesExercisesQuery.isLoading ||
    reformerExercisesQuery.isLoading ||
    yogaCategoriesQuery.isLoading ||
    pilatesCategoriesQuery.isLoading ||
    reformerCategoriesQuery.isLoading;

  // Hata durumu
  const isError =
    disciplinesQuery.isError ||
    yogaExercisesQuery.isError ||
    pilatesExercisesQuery.isError ||
    reformerExercisesQuery.isError ||
    yogaCategoriesQuery.isError ||
    pilatesCategoriesQuery.isError ||
    reformerCategoriesQuery.isError;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <View className="mt-md">
          <Typography variant="body" tone="muted">
            Pratikler yükleniyor...
          </Typography>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <Ionicons
          name="alert-circle-outline"
          size={36}
          color={colors.textMuted}
        />

        <View className="mt-md">
          <Typography variant="h3">
            Pratikler yüklenemedi
          </Typography>
        </View>

        <View className="mt-xs">
          <Typography
            variant="body"
            tone="muted"
            className="text-center"
          >
            İçeriklere ulaşırken bir sorun oluştu.
            Lütfen tekrar dene.
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* INTRODUCTION */}
      <View>
        <Typography variant="bodySmall" tone="muted">
          Kendine iyi gelecek pratikleri keşfet.
        </Typography>
      </View>

      {/* SEARCH */}
      <View className="mt-lg flex-row items-center gap-sm">
        <View className="flex-1 flex-row items-center rounded-full border border-border bg-surface px-md">
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textMuted}
          />

          <TextInput
            className="ml-sm flex-1 py-md text-base text-text"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Egzersiz, program veya hedef ara..."
            placeholderTextColor={colors.textSubtle}
            returnKeyType="search"
            accessibilityLabel="Egzersiz, program veya hedef ara"
          />

          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Aramayı temizle"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filtre seçenekleri"
          className="h-14 w-14 items-center justify-center rounded-full border border-border bg-surface"
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* FILTER CHIPS */}
      <ScrollView
        horizontal
        className="mt-md"
        contentContainerClassName="gap-sm"
        showsHorizontalScrollIndicator={false}
      >
        {exploreFilters.map((filter) => {
          const isSelected =
            selectedFilter === filter.key;

          return (
            <Pressable
              key={filter.key}
              onPress={() =>
                setSelectedFilter(filter.key)
              }
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
              }}
              className={[
                'rounded-full border px-lg py-sm',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-border bg-surface',
              ].join(' ')}
            >
              <Typography
                variant="bodySmall"
                className={
                  isSelected ? 'text-white' : ''
                }
              >
                {filter.label}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* FEATURED HERO CARD */}
      {featuredExercise ? (
        <View
          className="mt-lg"
          style={{
            marginHorizontal: -12,
          }}
        >
          <FeaturedPracticeCard
            title={featuredExercise.name}
            description={
              featuredExercise.description ??
              'Kendine iyi gelecek kısa bir pratikle devam et.'
            }
            duration={getDurationLabel(
              featuredExercise.durationSeconds,
            )}
            badgeLabel="Öne Çıkan"
            ctaLabel="Hemen Başla"
            imageSource={require('../../../../assets/images/explore/featured-yoga.png')}
          />
        </View>
      ) : null}

      {/* DISCIPLINES */}
      <View
        className="mt-lg"
        style={{
          width: '100%',
          alignSelf: 'stretch',
          minWidth: 0,
        }}
      >
        <DisciplineCards
          onSelect={(discipline: ExploreDiscipline) => {
            router.push(
              `/explore/discipline/${discipline}` as Href,
            );
          }}
        />
      </View>

      {/* PERSONALIZED RECOMMENDATIONS */}
      {visibleRecommendations.length > 0 ? (
        <View
          style={{ marginHorizontal: -12, marginTop: 0 }}
        >
          <RecommendedExercisesSection
            recommendations={visibleRecommendations}
            onExercisePress={(recommendation) => {
              router.push({
                pathname: '/exercise/[slug]',
                params: {
                  slug: recommendation.exercise.slug,
                },
              });
            }}
          />
        </View>
      ) : recommendedExercises.length > 0 ? (
        <View className="mt-lg items-center py-lg">
          <Typography variant="bodySmall" tone="muted">
            Bu arama veya filtreyle eşleşen öneri bulunamadı.
          </Typography>
        </View>
      ) : null}

      {/* EXPLORE BY GOAL */}
      <View
        className="mt-lg"
        style={{ marginHorizontal: -12 }}
      >
        <ExploreGoalCards
          onGoalPress={(goal) => {
            router.push({
              pathname: '/explore/goal/[goal]',
              params: {
                goal: goal.key,
              },
            });
          }}
        />
      </View>

      {/* CURATED EXERCISE COLLECTIONS */}
      {collectionsQuery.data && collectionsQuery.data.length > 0 ? (
        <View className="mt-lg" style={{ marginHorizontal: -12 }}>
          <ExploreCollectionsSection
            collections={collectionsQuery.data}
            onCollectionPress={(collection) => {
              router.push({
                pathname: '/explore/collection/[slug]',
                params: { slug: collection.slug },
              });
            }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
