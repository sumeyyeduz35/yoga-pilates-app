
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
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Typography } from '@/components/ui/Typography';
import {
  useDisciplinesQuery,
  useExercisesQuery,
} from '@/features/content/queries/content-queries';
import { ExplorePracticeCard } from '@/features/explore/components/ExplorePracticeCard';
import { useTheme } from '@/providers/theme-provider';

const disciplineDetails = {
  yoga: {
    title: 'Yoga',
    description: 'Dengeni bul, bedenini ve zihnini rahatlat.',
    background: '#E5E9DC',
    accent: '#4A6757',
    leaf: '#91A18B',
  },
  pilates: {
    title: 'Pilates',
    description: 'Gücünü, kontrolünü ve esnekliğini geliştir.',
    background: '#F7E9DD',
    accent: '#A78464',
    leaf: '#D5AD8E',
  },
  reformer: {
    title: 'Reformer',
    description: 'Kontrollü hareketlerle bedenini güçlendir.',
    background: '#F4E0DC',
    accent: '#A77970',
    leaf: '#C99B91',
  },
} as const;

type DisciplineKey = keyof typeof disciplineDetails;

function isDisciplineKey(value: unknown): value is DisciplineKey {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(disciplineDetails, value)
  );
}

function durationLabel(seconds: number | null) {
  if (seconds == null) {
    return 'Süre belirtilmedi';
  }

  if (seconds < 60) {
    return `${seconds} sn`;
  }

  return `${Math.ceil(seconds / 60)} dk`;
}

function difficultyLabel(value: string) {
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

function BotanicalDecoration({ color }: { color: string }) {
  return (
    <View pointerEvents="none" style={styles.botanical}>
      <Svg width={150} height={170} viewBox="0 0 150 170" fill="none">
        <Path
          d="M140 170C126 125 100 87 67 48M125 136C93 126 67 109 48 87M103 96C116 67 118 41 107 13"
          stroke={color}
          strokeWidth={1.6}
          opacity={0.35}
        />
        <Path
          d="M76 61C44 53 31 27 33 9C59 21 75 39 76 61Z"
          fill={color}
          opacity={0.2}
        />
        <Path
          d="M111 68C90 48 94 25 106 6C124 23 128 46 111 68Z"
          fill={color}
          opacity={0.24}
        />
        <Path
          d="M105 111C74 113 53 103 36 87C65 76 92 89 105 111Z"
          fill={color}
          opacity={0.22}
        />
        <Path
          d="M132 149C109 143 94 124 93 108C116 114 130 129 132 149Z"
          fill={color}
          opacity={0.2}
        />
      </Svg>
    </View>
  );
}

export default function DisciplineExploreScreen() {
  const router = useRouter();

  const { discipline: slug } =
    useLocalSearchParams<{ discipline: string }>();

  const { colors } = useTheme();

  const validSlug = isDisciplineKey(slug) ? slug : null;

  const details = validSlug
    ? disciplineDetails[validSlug]
    : null;

  const disciplinesQuery = useDisciplinesQuery();

  const discipline = disciplinesQuery.data?.find(
    (item) => item.slug === validSlug,
  );

  const exercisesQuery = useExercisesQuery(discipline?.id);

  const isLoading =
    disciplinesQuery.isLoading ||
    (Boolean(discipline) && exercisesQuery.isLoading);

  const isError =
    disciplinesQuery.isError ||
    exercisesQuery.isError;

  if (!details) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View className="flex-1 items-center justify-center bg-background px-lg">
          <Typography variant="h3">
            Disiplin bulunamadı
          </Typography>

          <Pressable
            onPress={() => router.back()}
            className="mt-lg"
            accessibilityRole="button"
          >
            <Typography variant="body">
              Geri dön
            </Typography>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="px-lg pb-2xl pt-lg"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Geri dönüş */}
        <Pressable
          onPress={() => router.back()}
          className="mb-lg flex-row items-center gap-sm"
          accessibilityRole="button"
          accessibilityLabel="Keşfet ekranına geri dön"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />

          <Typography variant="bodySmall">
            Keşfet
          </Typography>
        </Pressable>

        {/* Disipline özel üst kart */}
        <View
          style={[
            styles.hero,
            { backgroundColor: details.background },
          ]}
        >
          <BotanicalDecoration color={details.leaf} />

          <View style={styles.heroContent}>
            <View
              style={[
                styles.badge,
                { backgroundColor: details.accent },
              ]}
            >
              <Text style={styles.badgeText}>
                DİSİPLİNİ KEŞFET
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              {details.title}
            </Text>

            <Text style={styles.heroDescription}>
              {details.description}
            </Text>
          </View>
        </View>

        {/* Egzersiz listesi */}
        <View className="mt-2xl flex-row items-end justify-between">
          <Typography variant="h2">
            Egzersizler
          </Typography>

          {!isLoading && !isError && discipline ? (
            <Typography variant="caption" tone="muted">
              {exercisesQuery.data?.length ?? 0} egzersiz
            </Typography>
          ) : null}
        </View>

        {isLoading ? (
          <View className="items-center py-2xl">
            <ActivityIndicator
              size="large"
              color={details.accent}
            />
          </View>
        ) : isError ? (
          <View className="py-2xl">
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={colors.textMuted}
            />

            <View className="mt-md">
              <Typography variant="body" tone="muted">
                Egzersizler yüklenemedi. Lütfen tekrar dene.
              </Typography>
            </View>
          </View>
        ) : !discipline || !exercisesQuery.data?.length ? (
          <View className="py-2xl">
            <Typography variant="body" tone="muted">
              Bu disiplin için henüz egzersiz bulunmuyor.
            </Typography>
          </View>
        ) : (
          <View className="mt-md gap-md">
            {exercisesQuery.data.map((exercise) => (
              <ExplorePracticeCard
                key={exercise.id}
                title={exercise.name}
                description={
                  exercise.description ??
                  'Açıklama bulunmuyor.'
                }
                discipline={validSlug!}
                disciplineLabel={discipline.name}
                duration={durationLabel(
                  exercise.durationSeconds,
                )}
                level={difficultyLabel(
                  exercise.difficulty,
                )}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 185,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },

  botanical: {
    position: 'absolute',
    right: -8,
    top: 0,
  },

  heroContent: {
    maxWidth: '78%',
    zIndex: 1,
  },

  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 14,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },

  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    fontFamily: 'serif',
    color: '#253027',
    marginBottom: 7,
    includeFontPadding: false,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#53544D',
  },
});
