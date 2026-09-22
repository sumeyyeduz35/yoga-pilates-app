import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center bg-background px-lg">
      <View className="rounded-xl bg-primary p-lg">
        <Text className="text-sm font-semibold uppercase tracking-widest text-primary-soft">
          DESIGN SYSTEM
        </Text>

        <Text className="mt-md text-3xl font-bold text-surface">Yoga & Pilates</Text>

        <Text className="mt-sm text-base text-primary-soft">
          Move, breathe and build your practice.
        </Text>
      </View>

      <View className="mt-lg flex-row gap-md">
        <View className="flex-1 rounded-lg border border-border bg-surface p-md">
          <Text className="text-xl font-bold text-text">Yoga</Text>
          <Text className="mt-sm text-sm text-text-muted">Mind & Balance</Text>
        </View>

        <View className="flex-1 rounded-lg border border-border bg-surface p-md">
          <Text className="text-xl font-bold text-text">Pilates</Text>
          <Text className="mt-sm text-sm text-text-muted">Core & Strength</Text>
        </View>
      </View>
    </View>
  );
}
