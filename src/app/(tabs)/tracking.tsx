
import { ScrollView, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export default function TrackingScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      {/* Page Introduction */}
      <View className="mb-sm">
        <Typography variant="body">
          Gelişimini birlikte takip edelim.
        </Typography>
      </View>

      {/* Tracking Cards */}
      <View className="mt-xl gap-md">
        <View className="rounded-xl bg-surface p-lg">
          <Typography variant="h3">
            Su Takibi
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs"
          >
            Günlük su tüketimin
          </Typography>
        </View>

        <View className="rounded-xl bg-surface p-lg">
          <Typography variant="h3">
            Kalori Takibi
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs"
          >
            Günlük kalori alımın
          </Typography>
        </View>

        <View className="rounded-xl bg-surface p-lg">
          <Typography variant="h3">
            Egzersiz Takibi
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs"
          >
            Antrenmanların ve sürelerin
          </Typography>
        </View>

        <View className="rounded-xl bg-surface p-lg">
          <Typography variant="h3">
            Gelişim Analizi
          </Typography>

          <Typography
            variant="bodySmall"
            tone="muted"
            className="mt-xs"
          >
            Haftalık ve aylık ilerlemen
          </Typography>
        </View>
      </View>
    </ScrollView>
  );
}
