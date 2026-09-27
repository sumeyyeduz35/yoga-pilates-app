import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Typography } from '@/components/ui/Typography';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-background px-lg py-2xl">
      <Typography variant="h1">Profil</Typography>

      <View className="mt-xl">
        <Link href="/settings" asChild>
          <Pressable
            accessibilityRole="button"
            className="rounded-xl border border-border bg-surface p-lg"
          >
            <Typography variant="body">Ayarlar</Typography>
          </Pressable>
        </Link>
      </View>

      {__DEV__ && (
        <View className="mt-md">
          <Link href="/(dev)/design-preview" asChild>
            <Pressable className="rounded-xl border border-border p-lg">
              <Typography variant="body">Geliştirici: Tasarım Testi</Typography>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}
