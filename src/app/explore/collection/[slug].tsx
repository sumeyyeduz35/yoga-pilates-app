
import { Ionicons } from '@expo/vector-icons';
import {
    Stack,
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDisciplinesQuery } from '@/features/content/queries/content-queries';
import { useExerciseCollectionQuery } from '@/features/explore/queries/collection-queries';
import { useTheme } from '@/providers/theme-provider';

const COLLECTION_APPEARANCES: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    backgroundColor: string;
    iconColor: string;
  }
> = {
  'morning-energy': {
    icon: 'sunny-outline',
    backgroundColor: '#E7EDE1',
    iconColor: '#708B6C',
  },
  'evening-relaxation': {
    icon: 'moon-outline',
    backgroundColor: '#ECE6F1',
    iconColor: '#8E79A7',
  },
  'desk-break': {
    icon: 'cafe-outline',
    backgroundColor: '#F4E8DB',
    iconColor: '#B38C6D',
  },
  'beginner-essentials': {
    icon: 'leaf-outline',
    backgroundColor: '#E5ECE9',
    iconColor: '#698B83',
  },
};

const DEFAULT_APPEARANCE = {
  icon: 'albums-outline' as const,
  backgroundColor: '#E8EDE5',
  iconColor: '#708B6C',
};

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

export default function CollectionDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const { slug } = useLocalSearchParams<{
    slug: string;
  }>();

  const collectionQuery = useExerciseCollectionQuery(slug);
  const disciplinesQuery = useDisciplinesQuery();

  const collection = collectionQuery.data;

  const appearance = collection
    ? COLLECTION_APPEARANCES[collection.slug] ??
      DEFAULT_APPEARANCE
    : DEFAULT_APPEARANCE;

  const isLoading =
    collectionQuery.isPending ||
    disciplinesQuery.isPending;

  const isError =
    collectionQuery.isError ||
    disciplinesQuery.isError;

  const disciplineById = new Map(
    (disciplinesQuery.data ?? []).map((discipline) => [
      discipline.id,
      discipline,
    ]),
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
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
                Koleksiyon yükleniyor...
              </Text>
            </View>
          ) : isError ? (
            <View className="items-center py-2xl">
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={colors.textMuted}
              />

              <Text
                className="mt-md text-center text-base"
                style={{ color: colors.text }}
              >
                Koleksiyon yüklenemedi.
                Lütfen tekrar dene.
              </Text>

              <Pressable
                onPress={() => {
                  void collectionQuery.refetch();
                  void disciplinesQuery.refetch();
                }}
                accessibilityRole="button"
                className="mt-lg rounded-full bg-primary px-lg py-md"
              >
                <Text className="font-semibold text-white">
                  Tekrar Dene
                </Text>
              </Pressable>
            </View>
          ) : !collection ? (
            <View className="items-center py-2xl">
              <Ionicons
                name="search-outline"
                size={40}
                color={colors.textMuted}
              />

              <Text
                className="mt-md text-lg font-semibold"
                style={{ color: colors.text }}
              >
                Koleksiyon bulunamadı
              </Text>

              <Text
                className="mt-sm text-center text-sm"
                style={{ color: colors.textMuted }}
              >
                Bu koleksiyon henüz yayında olmayabilir.
              </Text>
            </View>
          ) : (
            <>
              {/* KOLEKSİYON ÜST KARTI */}
              <View
                style={{
                  backgroundColor:
                    appearance.backgroundColor,
                  borderRadius: 24,
                  overflow: 'hidden',
                  padding: 24,
                }}
              >
                {collection.coverImageUrl ? (
                  <Image
                    source={{
                      uri: collection.coverImageUrl,
                    }}
                    resizeMode="cover"
                    style={{
                      width: '100%',
                      height: 160,
                      borderRadius: 18,
                      marginBottom: 18,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: '#FFFFFFB8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 18,
                    }}
                  >
                    <Ionicons
                      name={appearance.icon}
                      size={28}
                      color={appearance.iconColor}
                    />
                  </View>
                )}

                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    letterSpacing: 1.1,
                    color: appearance.iconColor,
                    marginBottom: 10,
                  }}
                >
                  ÖZENLE SEÇİLMİŞ PRATİKLER
                </Text>

                <Text
                  style={{
                    fontSize: 27,
                    lineHeight: 35,
                    fontWeight: '700',
                    color: '#29362D',
                    marginBottom: 8,
                  }}
                >
                  {collection.title}
                </Text>

                {collection.description ? (
                  <Text
                    style={{
                      fontSize: 13,
                      lineHeight: 21,
                      color: '#596259',
                    }}
                  >
                    {collection.description}
                  </Text>
                ) : null}
              </View>

              {/* EGZERSİZ SAYISI */}
              <View className="mb-md mt-xl">
                <Text
                  className="text-xl font-semibold"
                  style={{ color: colors.text }}
                >
                  Koleksiyondaki Egzersizler
                </Text>

                <Text
                  className="mt-xs text-sm"
                  style={{ color: colors.textMuted }}
                >
                  {collection.items.length} egzersiz
                </Text>
              </View>

              {/* BOŞ KOLEKSİYON */}
              {collection.items.length === 0 ? (
                <View className="items-center rounded-2xl border border-border bg-surface px-lg py-2xl">
                  <Ionicons
                    name="leaf-outline"
                    size={36}
                    color={colors.textMuted}
                  />

                  <Text
                    className="mt-md text-center text-base"
                    style={{ color: colors.text }}
                  >
                    Bu koleksiyona henüz egzersiz eklenmedi.
                  </Text>
                </View>
              ) : (
                <View className="gap-md">
                  {collection.items.map((item) => {
                    const exercise = item.exercise;

                    const discipline = disciplineById.get(
                      exercise.disciplineId,
                    );

                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => {
                          router.push({
                            pathname: '/exercise/[slug]',
                            params: {
                              slug: exercise.slug,
                            },
                          });
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`${exercise.name} detayını aç`}
                        className="rounded-2xl border border-border bg-surface p-lg"
                      >
                        <View className="flex-row items-center gap-md">
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 14,
                              backgroundColor:
                                appearance.backgroundColor,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Ionicons
                              name="leaf-outline"
                              size={22}
                              color={appearance.iconColor}
                            />
                          </View>

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
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
