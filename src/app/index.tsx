
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/providers/theme-provider';
import type { ThemePreference } from '@/store/use-app-store';

const themeOptions = [
  { label: 'Sistem', value: 'system' },
  { label: 'Açık', value: 'light' },
  { label: 'Koyu', value: 'dark' },
] as const;

export default function HomeScreen() {
  const { preference, setPreference } = useTheme();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center px-lg py-2xl">
        {/* Ana tanıtım kartı */}
        <View className="rounded-xl bg-primary p-lg">
          <Text className="font-manrope-semibold text-sm uppercase tracking-wide text-primary-soft">
            DESIGN SYSTEM
          </Text>

          <Text className="mt-md font-manrope-bold text-3xl text-surface">
            Yoga, Pilates & Reformer
          </Text>

          <Text className="mt-sm font-manrope text-base text-surface">
            Move, breathe and build your practice.
          </Text>
        </View>

        {/* Disiplin kartları */}
        <View className="mt-lg gap-md">
          <View className="rounded-lg border border-border bg-yoga-soft p-md">
            <View className="mb-sm h-1 w-12 rounded-full bg-yoga" />
            <Text className="font-manrope-bold text-xl text-text">
              Yoga
            </Text>
            <Text className="mt-xs font-manrope text-sm text-text-muted">
              Mind & Balance
            </Text>
          </View>

          <View className="rounded-lg border border-border bg-pilates-soft p-md">
            <View className="mb-sm h-1 w-12 rounded-full bg-pilates" />
            <Text className="font-manrope-bold text-xl text-text">
              Pilates
            </Text>
            <Text className="mt-xs font-manrope text-sm text-text-muted">
              Core & Strength
            </Text>
          </View>

          <View className="rounded-lg border border-border bg-reformer-soft p-md">
            <View className="mb-sm h-1 w-12 rounded-full bg-reformer" />
            <Text className="font-manrope-bold text-xl text-text">
              Reformer
            </Text>
            <Text className="mt-xs font-manrope text-sm text-text-muted">
              Strength & Control
            </Text>
          </View>
        </View>

        {/* Tema değiştirme alanı */}
        <View className="mt-xl">
          <Text className="font-manrope-semibold text-lg text-text">
            Görünüm
          </Text>

          <Text className="mt-xs font-manrope text-sm text-text-muted">
            Uygulamanın temasını seç.
          </Text>

          <View className="mt-md flex-row gap-sm">
            {themeOptions.map((option) => {
              const active = preference === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() =>
                    setPreference(option.value as ThemePreference)
                  }
                  className={
                    active
                      ? 'flex-1 items-center rounded-md border border-primary bg-primary p-sm'
                      : 'flex-1 items-center rounded-md border border-border bg-surface p-sm'
                  }
                >
                  <Text
                    className={
                      active
                        ? 'font-manrope-semibold text-sm text-surface'
                        : 'font-manrope-medium text-sm text-text'
                    }
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}