
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { signOut } from '@/features/auth/services/auth-service';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileScreen() {
  const { session, profile, profileError } = useAuth();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = session?.user.email;

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setError(null);
    setIsSigningOut(true);

    try {
      const { error: signOutError } = await signOut();

      if (signOutError) {
        setError(
          'Çıkış yapılırken bir hata oluştu. Lütfen tekrar dene.',
        );
        return;
      }

      router.replace('/(auth)/login');
    } catch {
      setError(
        'Çıkış yapılırken bir hata oluştu. Lütfen tekrar dene.',
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-lg pb-2xl pt-lg"
      showsVerticalScrollIndicator={false}
    >
      {/* Page Introduction */}
      <View className="mb-sm">
        <Typography variant="body">
          Kişisel bilgilerin ve hesap ayarların.
        </Typography>
      </View>

      {/* Account Information */}
      <View className="mt-xl rounded-xl border border-border bg-surface p-lg">
        <Typography variant="h3">
          Hesap Bilgileri
        </Typography>

        <View className="mt-lg">
          <Typography variant="bodySmall" tone="muted">
            E-posta
          </Typography>

          <Typography variant="body" className="mt-xs">
            {email ?? 'E-posta bilgisi bulunamadı'}
          </Typography>
        </View>

        <View className="mt-md">
          <Typography variant="bodySmall" tone="muted">
            Ad Soyad
          </Typography>

          <Typography variant="body" className="mt-xs">
            {profile?.full_name ?? 'Henüz belirtilmedi'}
          </Typography>
        </View>

        <View className="mt-md">
          <Typography variant="bodySmall" tone="muted">
            Onboarding
          </Typography>

          <Typography variant="body" className="mt-xs">
            {profile?.onboarding_completed
              ? 'Tamamlandı'
              : 'Tamamlanmadı'}
          </Typography>
        </View>

        {profileError && (
          <Typography
            variant="bodySmall"
            tone="danger"
            className="mt-md"
          >
            {profileError}
          </Typography>
        )}
      </View>

      {/* Settings */}
      <View className="mt-md">
        <Link href="/settings" asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ayarları aç"
            className="flex-row items-center justify-between rounded-xl border border-border bg-surface p-lg"
          >
            <Typography variant="body">
              Ayarlar
            </Typography>

            <Typography variant="bodySmall" tone="muted">
              ›
            </Typography>
          </Pressable>
        </Link>
      </View>

      {/* Developer Preview */}
      {__DEV__ && (
        <View className="mt-md">
          <Link href="/(dev)/design-preview" asChild>
            <Pressable
              accessibilityRole="button"
              className="rounded-xl border border-border bg-surface p-lg"
            >
              <Typography variant="body">
                Geliştirici: Tasarım Testi
              </Typography>
            </Pressable>
          </Link>
        </View>
      )}

      {/* Sign Out Error */}
      {error && (
        <Typography
          variant="bodySmall"
          tone="danger"
          className="mt-lg"
        >
          {error}
        </Typography>
      )}

      {/* Sign Out */}
      <View className="mt-xl">
        <Button
          label="Çıkış Yap"
          variant="outline"
          fullWidth
          loading={isSigningOut}
          onPress={() => void handleSignOut()}
        />
      </View>
    </ScrollView>
  );
}
