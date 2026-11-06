import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

type ExploreDiscipline = 'yoga' | 'pilates' | 'reformer';

export type ExploreAdvancedFilters = {
  disciplines: ExploreDiscipline[];
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  duration: 'all' | 'under5' | '5to15' | '15to30' | 'over30';
};

export const DEFAULT_EXPLORE_FILTERS: ExploreAdvancedFilters = {
  disciplines: [],
  difficulty: 'all',
  duration: 'all',
};

type ExploreFilterModalProps = {
  visible: boolean;
  filters: ExploreAdvancedFilters;
  onClose: () => void;
  onApply: (filters: ExploreAdvancedFilters) => void;
};

const disciplineOptions: {
  label: string;
  value: ExploreDiscipline;
}[] = [
  { label: 'Yoga', value: 'yoga' },
  { label: 'Pilates', value: 'pilates' },
  { label: 'Reformer', value: 'reformer' },
];

const difficultyOptions = [
  { label: 'Tümü', value: 'all' },
  { label: 'Başlangıç', value: 'beginner' },
  { label: 'Orta', value: 'intermediate' },
  { label: 'İleri', value: 'advanced' },
] as const;

const durationOptions = [
  { label: 'Tümü', value: 'all' },
  { label: '5 dk altı', value: 'under5' },
  { label: '5–15 dk', value: '5to15' },
  { label: '15–30 dk', value: '15to30' },
  { label: '30 dk üzeri', value: 'over30' },
] as const;

export function ExploreFilterModal({
  visible,
  filters,
  onClose,
  onApply,
}: ExploreFilterModalProps) {
  const { colors } = useTheme();

  const [draftFilters, setDraftFilters] = useState<ExploreAdvancedFilters>(filters);

  function updateFilter<K extends keyof ExploreAdvancedFilters>(
    key: K,
    value: ExploreAdvancedFilters[K],
  ) {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleDiscipline(discipline: ExploreDiscipline) {
    setDraftFilters((current) => {
      const isSelected = current.disciplines.includes(discipline);

      return {
        ...current,
        disciplines: isSelected
          ? current.disciplines.filter((item) => item !== discipline)
          : [...current.disciplines, discipline],
      };
    });
  }

  function renderOption(label: string, selected: boolean, onPress: () => void) {
    return (
      <Pressable
        key={label}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        className={[
          'rounded-full border px-md py-sm',
          selected ? 'border-primary bg-primary' : 'border-border bg-surface',
        ].join(' ')}
      >
        <Typography variant="bodySmall" className={selected ? 'text-white' : ''}>
          {label}
        </Typography>
      </Pressable>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      onShow={() =>
        setDraftFilters({
          ...filters,
          disciplines: [...filters.disciplines],
        })
      }
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[85%] rounded-t-3xl bg-background px-lg pb-xl pt-lg">
          <View className="mb-lg flex-row items-center justify-between">
            <Typography variant="h2">Filtreler</Typography>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Filtreleri kapat"
              className="h-10 w-10 items-center justify-center rounded-full bg-surface"
            >
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-lg">
            {/* DISCIPLINES */}
            <View className="mb-xl">
              <Typography variant="h3">Disiplin</Typography>

              <View className="mt-md flex-row flex-wrap gap-sm">
                {renderOption('Tümü', draftFilters.disciplines.length === 0, () =>
                  updateFilter('disciplines', []),
                )}

                {disciplineOptions.map((option) =>
                  renderOption(option.label, draftFilters.disciplines.includes(option.value), () =>
                    toggleDiscipline(option.value),
                  ),
                )}
              </View>

              <View className="mt-sm">
                <Typography variant="caption" tone="muted">
                  Birden fazla disiplin seçebilirsin.
                </Typography>
              </View>
            </View>

            {/* DIFFICULTY */}
            <View className="mb-xl">
              <Typography variant="h3">Zorluk Seviyesi</Typography>

              <View className="mt-md flex-row flex-wrap gap-sm">
                {difficultyOptions.map((option) =>
                  renderOption(option.label, draftFilters.difficulty === option.value, () =>
                    updateFilter('difficulty', option.value),
                  ),
                )}
              </View>
            </View>

            {/* DURATION */}
            <View>
              <Typography variant="h3">Süre</Typography>

              <View className="mt-md flex-row flex-wrap gap-sm">
                {durationOptions.map((option) =>
                  renderOption(option.label, draftFilters.duration === option.value, () =>
                    updateFilter('duration', option.value),
                  ),
                )}
              </View>
            </View>
          </ScrollView>

          {/* ACTIONS */}
          <View className="gap-sm border-t border-border pt-md">
            <Button label="Sonuçları Göster" fullWidth onPress={() => onApply(draftFilters)} />

            <Button
              label="Filtreleri Temizle"
              variant="ghost"
              fullWidth
              onPress={() =>
                setDraftFilters({
                  ...DEFAULT_EXPLORE_FILTERS,
                  disciplines: [],
                })
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
