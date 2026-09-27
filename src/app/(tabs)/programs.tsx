import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export default function ProgramsScreen() {
  return (
    <View className="flex-1 bg-background px-lg py-2xl">
      <Typography variant="h1">Programlar</Typography>
      <Typography variant="body" tone="muted">
        Kişisel antrenman programlarını burada takip et.
      </Typography>
    </View>
  );
}
