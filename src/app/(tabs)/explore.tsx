import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export default function ExploreScreen() {
  return (
    <View className="flex-1 bg-background px-lg py-2xl">
      <Typography variant="h1">Keşfet</Typography>
      <Typography variant="body" tone="muted">
        Yoga, Pilates ve Reformer egzersizlerini keşfet.
      </Typography>
    </View>
  );
}
