
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
    useDisciplinesQuery,
    useExerciseBySlugQuery,
} from '@/features/content/queries/content-queries';
import type { Difficulty } from '@/features/content/types/content';
import { useTheme } from '@/providers/theme-provider';

const DEFAULT_IMAGE = require(
  '../../../assets/images/explore/featured-yoga.png'
);

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Başlangıç',
  intermediate: 'Orta',
  advanced: 'İleri',
};

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const { slug } = useLocalSearchParams<{
    slug: string;
  }>();

  const exerciseQuery = useExerciseBySlugQuery(slug);
  const disciplinesQuery = useDisciplinesQuery();

  const exercise = exerciseQuery.data;

  const discipline = disciplinesQuery.data?.find(
    (item) => item.id === exercise?.disciplineId,
  );

  const durationLabel =
    exercise?.durationSeconds == null
      ? 'Süre belirtilmedi'
      : exercise.durationSeconds < 60
        ? `${exercise.durationSeconds} sn`
        : `${Math.ceil(exercise.durationSeconds / 60)} dk`;

  // YÜKLENME EKRANI
  if (exerciseQuery.isPending || disciplinesQuery.isPending) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        className="flex-1 bg-background"
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text
            style={{
              color: colors.textMuted,
              marginTop: 12,
            }}
          >
            Egzersiz yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // HATA EKRANI
  if (exerciseQuery.isError || disciplinesQuery.isError) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        className="flex-1 bg-background"
      >
        <View className="flex-1 items-center justify-center px-lg">
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={colors.textMuted}
          />

          <Text
            className="mt-md text-center text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Egzersiz yüklenemedi
          </Text>

          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
            className="mt-lg rounded-full bg-primary px-lg py-md"
          >
            <Text className="font-semibold text-white">
              Geri Dön
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // EGZERSİZ BULUNAMADI
  if (!exercise) {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        className="flex-1 bg-background"
      >
        <View className="flex-1 items-center justify-center px-lg">
          <Ionicons
            name="search-outline"
            size={40}
            color={colors.textMuted}
          />

          <Text
            className="mt-md text-center text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Egzersiz bulunamadı
          </Text>

          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
            className="mt-lg rounded-full bg-primary px-lg py-md"
          >
            <Text className="font-semibold text-white">
              Geri Dön
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // EGZERSİZ DETAY EKRANI
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2xl"
      >
        {/* ÜST BAŞLIK */}
        <View className="flex-row items-center px-lg py-md">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Geri dön"
            hitSlop={12}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>

          <Text
            className="ml-md text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Egzersiz Detayı
          </Text>
        </View>

        {/* EGZERSİZ GÖRSELİ */}
        <View className="mx-lg overflow-hidden rounded-2xl bg-surface">
          <Image
            source={
              exercise.imageUrl
                ? { uri: exercise.imageUrl }
                : DEFAULT_IMAGE
            }
            resizeMode="cover"
            style={{
              width: '100%',
              height: 230,
            }}
          />
        </View>

        <View className="px-lg pt-lg">
          {/* EGZERSİZ ADI */}
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.text }}
          >
            {exercise.name}
          </Text>

          {/* EGZERSİZ BİLGİLERİ */}
          <View className="mt-md flex-row flex-wrap gap-sm">
            {[
              discipline?.name ?? 'Egzersiz',
              DIFFICULTY_LABELS[exercise.difficulty],
              durationLabel,
            ].map((label, index) => (
              <View
                key={`${index}-${label}`}
                className="rounded-full border border-border bg-surface px-md py-sm"
              >
                <Text
                  className="text-xs font-medium"
                  style={{ color: colors.text }}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* AÇIKLAMA */}
          <View className="mt-2xl">
            <Text
              className="text-xl font-semibold"
              style={{ color: colors.text }}
            >
              Egzersiz Hakkında
            </Text>

            <Text
              className="mt-sm text-base leading-6"
              style={{ color: colors.textMuted }}
            >
              {exercise.description ||
                'Bu egzersiz için henüz açıklama eklenmedi.'}
            </Text>
          </View>

          {/* UYGULAMA TALİMATLARI */}
          <View className="mt-2xl">
            <Text
              className="text-xl font-semibold"
              style={{ color: colors.text }}
            >
              Nasıl Yapılır?
            </Text>

            <Text
              className="mt-sm text-base leading-7"
              style={{ color: colors.textMuted }}
            >
              {exercise.instructions ||
                'Bu egzersizin uygulama talimatları henüz eklenmedi.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
