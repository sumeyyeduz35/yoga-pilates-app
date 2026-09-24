
import { useColorScheme } from 'nativewind';
import {
    createContext,
    useContext,
    useEffect,
    useSyncExternalStore,
    type PropsWithChildren,
} from 'react';
import { View } from 'react-native';

import {
    useAppStore,
    type ThemePreference,
} from '@/store/use-app-store';

import {
    colorSchemes,
    type ColorSchemeName,
} from '@/theme/color-schemes';

import { themeVariables } from '@/theme/nativewind-vars';

type ThemeContextValue = {
  mode: ColorSchemeName;
  colors: (typeof colorSchemes)[ColorSchemeName];
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

// Zustand'ın kayıtlı tercihleri yüklemesini takip eder.
function subscribeHydration(callback: () => void) {
  return useAppStore.persist.onFinishHydration(callback);
}

function getHydrationSnapshot() {
  return useAppStore.persist.hasHydrated();
}

export function ThemeProvider({
  children,
}: PropsWithChildren) {
  const preference = useAppStore(
    (state) => state.themePreference
  );

  const setPreference = useAppStore(
    (state) => state.setThemePreference
  );

  const { colorScheme, setColorScheme } = useColorScheme();

  const hydrated = useSyncExternalStore(
    subscribeHydration,
    getHydrationSnapshot,
    () => false
  );

  useEffect(() => {
    if (hydrated) {
      setColorScheme(preference);
    }
  }, [hydrated, preference, setColorScheme]);

  const mode: ColorSchemeName =
    preference === 'system'
      ? colorScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  if (!hydrated) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colors: colorSchemes[mode],
        preference,
        setPreference,
      }}
    >
      <View
        className="flex-1"
        style={themeVariables[mode]}
      >
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }

  return context;
}