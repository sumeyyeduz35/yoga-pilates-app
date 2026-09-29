import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, TextInput, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useDisciplinesQuery, useExercisesQuery } from '@/features/content/queries/content-queries';
import type { DisciplineSlug } from '@/features/content/types/content';
import { ExplorePracticeCard } from '@/features/explore/components/ExplorePracticeCard';
import { useTheme } from '@/providers/theme-provider';

type ExploreFilterKey = 'all' | DisciplineSlug;

const exploreFilters: {
  key: ExploreFilterKey;
  label: string;
}[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'pilates', label: 'Pilates' },
  { key: 'reformer', label: 'Reformer' },
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

  const minutes = Math.ceil(durationSeconds / 60);

  return `${minutes} dk`;
}

export default function ExploreScreen() {
  const { colors } = useTheme();

  const [selectedFilter, setSelectedFilter] = useState<ExploreFilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const disciplinesQuery = useDisciplinesQuery();

  const selectedDiscipline =
    selectedFilter === 'all'
      ? undefined
      : disciplinesQuery.data?.find((discipline) => discipline.slug === selectedFilter);

  const yogaDiscipline = disciplinesQuery.data?.find((discipline) => discipline.slug === 'yoga');
  const pilatesDiscipline = disciplinesQuery.data?.find(
    (discipline) => discipline.slug === 'pilates',
  );
  const reformerDiscipline = disciplinesQuery.data?.find(
    (discipline) => discipline.slug === 'reformer',
  );

  const yogaExercisesQuery = useExercisesQuery(yogaDiscipline?.id);
  const pilatesExercisesQuery = useExercisesQuery(pilatesDiscipline?.id);
  const reformerExercisesQuery = useExercisesQuery(reformerDiscipline?.id);

  const exercises = useMemo(
    () => [
      ...(yogaExercisesQuery.data ?? []),
      ...(pilatesExercisesQuery.data ?? []),
      ...(reformerExercisesQuery.data ?? []),
    ],
    [yogaExercisesQuery.data, pilatesExercisesQuery.data, reformerExercisesQuery.data],
  );

  const filteredExercises = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');

    return exercises.filter((exercise) => {
      const discipline = disciplinesQuery.data?.find((item) => item.id === exercise.disciplineId);

      const matchesDiscipline =
        selectedFilter === 'all' || exercise.disciplineId === selectedDiscipline?.id;

      const searchableText = [
        exercise.name,
        exercise.description ?? '',
        discipline?.name ?? '',
        getDifficultyLabel(exercise.difficulty),
      ]
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      const matchesSearch =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesDiscipline && matchesSearch;
    });
  }, [disciplinesQuery.data, exercises, searchQuery, selectedDiscipline?.id, selectedFilter]);

  const isLoading =
    disciplinesQuery.isLoading ||
    yogaExercisesQuery.isLoading ||
    pilatesExercisesQuery.isLoading ||
    reformerExercisesQuery.isLoading;

  const isError =
    disciplinesQuery.isError ||
    yogaExercisesQuery.isError ||
    pilatesExercisesQuery.isError ||
    reformerExercisesQuery.isError;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-lg">
        <ActivityIndicator size="large" color={colors.primary} />

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
        <Ionicons name="alert-circle-outline" size={36} color={colors.textMuted} />

        <View className="mt-md">
          <Typography variant="h3">Pratikler yüklenemedi</Typography>
        </View>

        <View className="mt-xs">
          <Typography variant="body" tone="muted" className="text-center">
            İçeriklere ulaşırken bir sorun oluştu. Lütfen tekrar dene.
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
      <View>
        <Typography variant="h1">Keşfet</Typography>

        <View className="mt-xs">
          <Typography variant="body" tone="muted">
            Sana uygun hareketi ve pratiği keşfet.
          </Typography>
        </View>
      </View>

      <View className="mt-xl flex-row items-center rounded-lg border border-border bg-surface px-md">
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />

        <TextInput
          className="ml-sm flex-1 py-md text-base text-text"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Pratik ara..."
          placeholderTextColor={colors.textSubtle}
          returnKeyType="search"
          accessibilityLabel="Pratik ara"
        />

        {searchQuery.length > 0 ? (
          <Pressable
            onPress={() => setSearchQuery('')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Aramayı temizle"
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        className="mt-lg"
        contentContainerClassName="gap-sm"
        showsHorizontalScrollIndicator={false}
      >
        {exploreFilters.map((filter) => {
          const isSelected = selectedFilter === filter.key;

          return (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={[
                'rounded-full border px-lg py-sm',
                isSelected ? 'border-primary bg-primary' : 'border-border bg-surface',
              ].join(' ')}
            >
              <Typography
                variant="caption"
                tone="default"
                className={isSelected ? 'text-background' : ''}
              >
                {filter.label}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-xl">
        <View className="flex-row items-end justify-between">
          <Typography variant="h2">Pratikler</Typography>

          <Typography variant="caption" tone="muted">
            {filteredExercises.length} sonuç
          </Typography>
        </View>

        <View className="mt-md gap-md">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => {
              const discipline = disciplinesQuery.data?.find(
                (item) => item.id === exercise.disciplineId,
              );

              if (!discipline) {
                return null;
              }

              return (
                <ExplorePracticeCard
                  key={exercise.id}
                  title={exercise.name}
                  description={exercise.description ?? 'Açıklama bulunmuyor.'}
                  discipline={discipline.slug}
                  disciplineLabel={discipline.name}
                  duration={getDurationLabel(exercise.durationSeconds)}
                  level={getDifficultyLabel(exercise.difficulty)}
                />
              );
            })
          ) : (
            <View className="items-center py-2xl">
              <Ionicons name="search-outline" size={32} color={colors.textMuted} />

              <View className="mt-md">
                <Typography variant="h3">Sonuç bulunamadı</Typography>
              </View>

              <View className="mt-xs">
                <Typography variant="body" tone="muted" className="text-center">
                  Farklı bir arama veya disiplin deneyebilirsin.
                </Typography>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
