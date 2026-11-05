
import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { Difficulty } from '@/features/content/types/content';
import type { RecommendedExercise } from '@/features/explore/services/recommendation-service';

type RecommendedExerciseCardProps = {
  recommendation: RecommendedExercise;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
};

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string }
> = {
  beginner: {
    label: 'Başlangıç',
    color: '#64947B',
  },
  intermediate: {
    label: 'Orta',
    color: '#D59C55',
  },
  advanced: {
    label: 'İleri',
    color: '#BF7772',
  },
};

const DEFAULT_EXERCISE_IMAGE = require(
  '../../../../assets/images/explore/featured-yoga.png'
);

export function RecommendedExerciseCard({
  recommendation,
  onPress,
  onFavoritePress,
  isFavorite = false,
}: RecommendedExerciseCardProps) {
  const { exercise } = recommendation;

  const difficulty = DIFFICULTY_CONFIG[exercise.difficulty];

  const durationMinutes =
    exercise.durationSeconds != null
      ? Math.max(
          1,
          Math.ceil(exercise.durationSeconds / 60),
        )
      : null;

  const difficultyLevel =
    exercise.difficulty === 'beginner'
      ? 1
      : exercise.difficulty === 'intermediate'
        ? 2
        : 3;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${exercise.name}, ${difficulty.label}`}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            exercise.imageUrl
              ? { uri: exercise.imageUrl }
              : DEFAULT_EXERCISE_IMAGE
          }
          style={styles.image}
          resizeMode="cover"
        />

        {onFavoritePress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite
                ? 'Favorilerden çıkar'
                : 'Favorilere ekle'
            }
            onPress={onFavoritePress}
            hitSlop={8}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={
                isFavorite
                  ? 'heart'
                  : 'heart-outline'
              }
              size={21}
              color={
                isFavorite
                  ? '#B96F71'
                  : '#34473E'
              }
            />
          </Pressable>
        ) : null}

        {durationMinutes !== null ? (
          <View style={styles.durationBadge}>
            <Ionicons
              name="time-outline"
              size={12}
              color="#293D32"
            />

            <Text style={styles.durationText}>
              {durationMinutes} dk
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <Text
          style={styles.exerciseName}
          numberOfLines={2}
        >
          {exercise.name}
        </Text>

        <View style={styles.difficultyRow}>
          <View style={styles.difficultyBars}>
            {[0, 1, 2].map((index) => (
              <View
                key={index}
                style={[
                  styles.difficultyBar,
                  {
                    height: 5 + index * 3,
                    backgroundColor:
                      index < difficultyLevel
                        ? difficulty.color
                        : '#E4E6E1',
                  },
                ]}
              />
            ))}
          </View>

          <Text style={styles.difficultyLabel}>
            {difficulty.label}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#FFFEFC',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EAE8E2',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 108,
    backgroundColor: '#E6EAE2',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: 'rgba(255,254,252,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,254,252,0.94)',
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#293D32',
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 10,
    minHeight: 76,
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: '#262B27',
  },
  difficultyRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyBars: {
    height: 13,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  difficultyBar: {
    width: 4,
    borderRadius: 2,
  },
  difficultyLabel: {
    fontSize: 11,
    color: '#777E77',
  },
});
