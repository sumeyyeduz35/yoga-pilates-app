
import { Ionicons } from '@expo/vector-icons';
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

import type { ExerciseCollection } from '@/features/explore/types/collection';
import { useTheme } from '@/providers/theme-provider';

type CollectionAppearance = {
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
};

const COLLECTION_APPEARANCES: Record<
  string,
  CollectionAppearance
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

const DEFAULT_APPEARANCE: CollectionAppearance = {
  icon: 'albums-outline',
  backgroundColor: '#E8EDE5',
  iconColor: '#708B6C',
};

type ExploreCollectionsSectionProps = {
  collections: ExerciseCollection[];
  onCollectionPress: (collection: ExerciseCollection) => void;
  onSeeAllPress?: () => void;
};

export function ExploreCollectionsSection({
  collections,
  onCollectionPress,
  onSeeAllPress,
}: ExploreCollectionsSectionProps) {
  const { colors } = useTheme();

  if (collections.length === 0) {
    return null;
  }

  return (
    <View>
      {/* BÖLÜM BAŞLIĞI */}
      <View className="mb-sm flex-row items-center justify-between px-md">
        <Text
          className="text-lg font-bold"
          style={{ color: colors.text }}
        >
          Koleksiyonlar
        </Text>

        {onSeeAllPress ? (
          <Pressable
            onPress={onSeeAllPress}
            accessibilityRole="button"
            accessibilityLabel="Tüm koleksiyonları gör"
            hitSlop={10}
            className="flex-row items-center"
          >
            <Text
              className="text-xs"
              style={{ color: colors.textMuted }}
            >
              Tümünü Gör
            </Text>

            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* ALT AÇIKLAMA */}
      <Text
        className="mb-md px-md text-xs"
        style={{ color: colors.textMuted }}
      >
        Her anına uygun, özenle seçilmiş pratikler.
      </Text>

      {/* KOLEKSİYON KARTLARI */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          gap: 12,
        }}
      >
        {collections.map((collection) => {
          const appearance =
            COLLECTION_APPEARANCES[collection.slug] ??
            DEFAULT_APPEARANCE;

          return (
            <Pressable
              key={collection.id}
              onPress={() => onCollectionPress(collection)}
              accessibilityRole="button"
              accessibilityLabel={`${collection.title} koleksiyonunu aç`}
              style={{
                width: 190,
              }}
            >
              {/* KAPAK GÖRSELİ */}
              <View
                style={{
                  height: 138,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor:
                    appearance.backgroundColor,
                  alignItems: 'center',
                  justifyContent: 'center',
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
                      height: '100%',
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      backgroundColor: '#FFFFFFB8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={appearance.icon}
                      size={32}
                      color={appearance.iconColor}
                    />
                  </View>
                )}
              </View>

              {/* KOLEKSİYON ADI */}
              <Text
                className="mt-sm text-sm font-semibold"
                numberOfLines={2}
                style={{
                  color: colors.text,
                }}
              >
                {collection.title}
              </Text>

              {/* KOLEKSİYON AÇIKLAMASI */}
              {collection.description ? (
                <Text
                  className="mt-xs text-xs"
                  numberOfLines={2}
                  style={{
                    color: colors.textMuted,
                    lineHeight: 17,
                  }}
                >
                  {collection.description}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
