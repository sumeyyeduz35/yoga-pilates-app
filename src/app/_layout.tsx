import '../global.css';

import { Stack } from 'expo-router';

import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </QueryProvider>
  );
}
