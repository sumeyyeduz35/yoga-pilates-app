
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
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="settings"
          options={{
            title: 'Ayarlar',
            headerBackTitle: 'Geri',
          }}
        />

        <Stack.Screen
          name="tracking/achievements"
          options={{
            title: 'Tüm Başarılar',
            headerBackTitle: 'Geri',
            headerShown: true,
          }}
        />

        <Stack.Screen
  name="tracking/water"
  options={{
    title: 'Su Takibi',
    headerBackTitle: 'Geri',
    headerShown: true,
  }}
/>

        <Stack.Screen
          name="program/[slug]"
          options={{
            title: 'Program Detayı',
            headerBackTitle: 'Geri',
          }}
        />

        <Stack.Screen
          name="exercise/[slug]"
          options={{
            headerShown: false,
          }}
        />

        {__DEV__ && (
          <Stack.Screen
            name="(dev)/design-preview"
            options={{
              title: 'Tasarım Testi',
              headerBackTitle: 'Geri',
            }}
          />
        )}
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
