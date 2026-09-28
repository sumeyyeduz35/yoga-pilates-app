import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { ExplorePracticeCard } from '@/features/explore/components/ExplorePracticeCard';
import {
  exploreFilters,
  explorePractices,
  type ExploreFilterKey,
} from '@/features/explore/data/explore-data';
import { useTheme } from '@/providers/theme-provider';

export default function ExploreScreen() {
  const { colors } = useTheme();

  const [selectedFilter, setSelectedFilter] = useState<ExploreFilterKey>('all');

  const [searchQuery, setSearchQuery] = useState('');

  const filteredPractices = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');

    return explorePractices.filter((practice) => {
      const matchesDiscipline = selectedFilter === 'all' || practice.discipline === selectedFilter;

      const searchableText = [
        practice.title,
        practice.description,
        practice.disciplineLabel,
        practice.level,
      ]
        .join(' ')
        .toLocaleLowerCase('tr-TR');

      const matchesSearch =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

      return matchesDiscipline && matchesSearch;
    });
  }, [searchQuery, selectedFilter]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View>
        <Typography variant="h1">Keşfet</Typography>

        <View className="mt-xs">
          <Typography variant="body" tone="muted">
            Sana uygun hareketi ve pratiği keşfet.
          </Typography>
        </View>
      </View>

      {/* Search */}
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

      {/* Filters */}
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

      {/* Results */}
      <View className="mt-xl">
        <View className="flex-row items-end justify-between">
          <Typography variant="h2">Pratikler</Typography>

          <Typography variant="caption" tone="muted">
            {filteredPractices.length} sonuç
          </Typography>
        </View>

        <View className="mt-md gap-md">
          {filteredPractices.length > 0 ? (
            filteredPractices.map((practice) => (
              <ExplorePracticeCard
                key={practice.id}
                title={practice.title}
                description={practice.description}
                discipline={practice.discipline}
                disciplineLabel={practice.disciplineLabel}
                duration={practice.duration}
                level={practice.level}
              />
            ))
          ) : (
            <View className="items-center py-2xl">
              <Ionicons name="search-outline" size={32} color={colors.textMuted} />

              <View className="mt-md">
                <Typography variant="h3">Sonuç bulunamadı</Typography>
              </View>

              <View className="mt-xs">
                <Typography variant="body" tone="muted">
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
