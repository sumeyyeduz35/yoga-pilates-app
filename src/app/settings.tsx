import { Stack } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/providers/theme-provider';
import type { ThemePreference } from '@/store/use-app-store';

const themeOptions: {
  label: string;
  description: string;
  value: ThemePreference;
}[] = [
  {
    label: 'Sistem',
    description: 'Cihazının görünüm ayarını kullan.',
    value: 'system',
  },
  {
    label: 'Açık tema',
    description: 'Aydınlık ve doğal renkler.',
    value: 'light',
  },
  {
    label: 'Koyu tema',
    description: 'Daha koyu ve sakin görünüm.',
    value: 'dark',
  },
];

export default function SettingsScreen() {
  const { preference, setPreference } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Ayarlar' }} />

      <View className="px-lg py-xl">
        <Text className="font-manrope-bold text-2xl text-text">Görünüm</Text>

        <Text className="mt-xs font-manrope text-sm text-text-muted">
          Uygulamanın görünümünü özelleştir.
        </Text>

        <View className="mt-lg overflow-hidden rounded-lg border border-border bg-surface">
          {themeOptions.map((option, index) => {
            const selected = preference === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setPreference(option.value)}
                className={index > 0 ? 'border-t border-border p-md' : 'p-md'}
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="font-manrope-semibold text-base text-text">
                      {option.label}
                    </Text>

                    <Text className="mt-xs font-manrope text-sm text-text-muted">
                      {option.description}
                    </Text>
                  </View>

                  <View
                    className={
                      selected
                        ? 'h-6 w-6 items-center justify-center rounded-full bg-primary'
                        : 'h-6 w-6 rounded-full border-2 border-border-strong'
                    }
                  >
                    {selected && <View className="h-2 w-2 rounded-full bg-surface" />}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
