import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SessionScreenProps = {
  children: ReactNode;
  className?: string;
};

export function SessionScreen({
  children,
  className = '',
}: SessionScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={`flex-1 bg-background px-lg ${className}`}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: Math.max(
          insets.bottom + 12,
          24,
        ),
      }}
    >
      {children}
    </View>
  );
}