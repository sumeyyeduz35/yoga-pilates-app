import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center bg-stone-50 px-6">
      <View className="rounded-3xl bg-emerald-700 p-8">
        <Text className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
          PROJECT FOUNDATION
        </Text>

        <Text className="mt-4 text-3xl font-bold text-white">Yoga & Pilates</Text>

        <Text className="mt-3 text-base text-emerald-50">Your wellness journey starts here.</Text>
      </View>

      <View className="mt-6 flex-row gap-4">
        <View className="flex-1 rounded-2xl bg-white p-5">
          <Text className="text-xl font-bold text-stone-800">Yoga</Text>
          <Text className="mt-2 text-stone-500">Mind & Balance</Text>
        </View>

        <View className="flex-1 rounded-2xl bg-white p-5">
          <Text className="text-xl font-bold text-stone-800">Pilates</Text>
          <Text className="mt-2 text-stone-500">Core & Strength</Text>
        </View>
      </View>
    </View>
  );
}
