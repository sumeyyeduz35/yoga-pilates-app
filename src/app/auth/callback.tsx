import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>();

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function handleCallback() {
      if (params.error) {
        setErrorMessage(
          params.error_description ?? 'E-posta doğrulaması tamamlanamadı.',
        );
        return;
      }

      if (!params.access_token || !params.refresh_token) {
        setErrorMessage('Doğrulama bilgileri bulunamadı.');
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace('/');
    }

    void handleCallback();
  }, [
    params.access_token,
    params.error,
    params.error_description,
    params.refresh_token,
  ]);

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      {errorMessage ? (
        <>
          <Typography variant="h2">Doğrulama tamamlanamadı</Typography>

          <Typography
            variant="body"
            tone="muted"
            className="mt-3 text-center"
          >
            {errorMessage}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="h2">Hesabın doğrulanıyor</Typography>

          <Typography
            variant="body"
            tone="muted"
            className="mt-3 text-center"
          >
            Lütfen bekle...
          </Typography>
        </>
      )}
    </View>
  );
}