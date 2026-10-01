import '../global.css';

import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider, useTheme } from '@/providers/theme-provider';

// Fontlar yüklenene kadar Splash Screen görünür kalır.
void SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { colors, mode } = useTheme();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'Manrope_600SemiBold',
          },
        }}
      >
        {/* Ana yönlendirme */}
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        {/* Authentication ekranları */}
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />

        {/* Dört sekmeli ana navigasyon */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Profil üzerinden erişilen ayarlar */}
        <Stack.Screen
          name="settings"
          options={{
            title: 'Ayarlar',
            headerBackTitle: 'Geri',
          }}
        />

        {/* Program detay ekranı */}
        <Stack.Screen
          name="program/[slug]"
          options={{
            title: 'Program Detayı',
            headerBackTitle: 'Geri',
          }}
        />

        {/* Geliştirici tasarım test ekranı */}
        <Stack.Screen
          name="(dev)/design-preview"
          options={{
            title: 'Tasarım Testi',
            headerBackTitle: 'Geri',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
