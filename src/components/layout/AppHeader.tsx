
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LunivaLogo } from '@/features/home/components/LunivaLogo';
import { useTheme } from '@/providers/theme-provider';

type AppHeaderProps = {
  showProfile?: boolean;
  showNotifications?: boolean;
};

export function AppHeader({
  showProfile = false,
  showNotifications = false,
}: AppHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          minHeight: 50,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <LunivaLogo compact />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {showNotifications && (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.text}
              />
            </View>
          )}

          {showProfile && (
            <Pressable
              onPress={() => router.push('/(tabs)/profile')}
              accessibilityRole="button"
              accessibilityLabel="Profilime git"
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                overflow: 'hidden',
                backgroundColor: colors.surface,
              }}
            >
              <Image
                source={require('../../../assets/images/home/welcome-character.png')}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
