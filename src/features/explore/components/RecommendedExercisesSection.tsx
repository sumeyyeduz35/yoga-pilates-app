
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RecommendedExerciseCard } from '@/features/explore/components/RecommendedExerciseCard';
import type { RecommendedExercise } from '@/features/explore/services/recommendation-service';

type RecommendedExercisesSectionProps = {
  recommendations: RecommendedExercise[];
  onExercisePress: (recommendation: RecommendedExercise) => void;
  onSeeAllPress?: () => void;
  onFavoritePress?: (recommendation: RecommendedExercise) => void;
  favoriteExerciseIds?: string[];
};

export function RecommendedExercisesSection({
  recommendations,
  onExercisePress,
  onSeeAllPress,
  onFavoritePress,
  favoriteExerciseIds = [],
}: RecommendedExercisesSectionProps) {
  if (recommendations.length === 0) {
    return null;
  }

  const favorites = new Set(favoriteExerciseIds);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Senin İçin Önerilenler
        </Text>

        {onSeeAllPress ? (
          <Pressable
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel="Tüm önerileri gör"
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>
              Tümünü Gör
            </Text>

            <Ionicons
              name="chevron-forward"
              size={16}
              color="#66746C"
            />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {recommendations.map((recommendation) => (
          <RecommendedExerciseCard
            key={recommendation.exercise.id}
            recommendation={recommendation}
            onPress={() =>
              onExercisePress(recommendation)
            }
            onFavoritePress={
              onFavoritePress
                ? () => onFavoritePress(recommendation)
                : undefined
            }
            isFavorite={favorites.has(
              recommendation.exercise.id,
            )}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
  },

  header: {
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    flexShrink: 1,
    fontSize: 21,
    fontWeight: '600',
    color: '#26342B',
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingLeft: 8,
  },

  seeAllText: {
    fontSize: 12,
    color: '#66746C',
  },

  listContent: {
    gap: 11,
    paddingHorizontal: 12,
    paddingBottom: 3,
  },
});
