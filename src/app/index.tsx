import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';

export default function HomeScreen() {
  // Geçici Input test formunun state'leri
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);

  // E-posta biçim kontrolü
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailInvalid = showEmailError && !emailPattern.test(email.trim());

  // E-posta test butonu
  function handleEmailValidation() {
    setShowEmailError(true);

    if (emailPattern.test(email.trim())) {
      Alert.alert('Başarılı', 'E-posta biçimi doğru.');
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 px-lg py-2xl">
        {/* AYARLAR */}
        <View className="mb-lg flex-row justify-end">
          <Link href="/settings" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ayarları aç"
              className="rounded-full border border-border bg-surface px-md py-sm"
            >
              <Text className="font-manrope-semibold text-sm text-text">⚙ Ayarlar</Text>
            </Pressable>
          </Link>
        </View>

        {/* ANA TANITIM KARTI */}
        <Card padding="lg" className="bg-primary">
          <Text className="font-manrope-semibold text-sm uppercase tracking-wide text-primary-soft">
            DESIGN SYSTEM
          </Text>

          <Text className="mt-md font-manrope-bold text-3xl text-surface">
            Yoga, Pilates & Reformer
          </Text>

          <Text className="mt-sm font-manrope text-base text-surface">
            Move, breathe and build your practice.
          </Text>
        </Card>

        {/* DİSİPLİN KARTLARI */}
        <View className="mt-lg gap-md">
          {/* Yoga */}
          <Card discipline="yoga" variant="outlined">
            <View className="mb-sm h-1 w-12 rounded-full bg-yoga" />

            <Typography variant="h2">Yoga</Typography>

            <Typography variant="bodySmall" tone="muted" className="mt-xs">
              Mind & Balance
            </Typography>
          </Card>

          {/* Pilates */}
          <Card discipline="pilates" variant="outlined">
            <View className="mb-sm h-1 w-12 rounded-full bg-pilates" />

            <Typography variant="h2">Pilates</Typography>

            <Typography variant="bodySmall" tone="muted" className="mt-xs">
              Core & Strength
            </Typography>
          </Card>

          {/* Reformer */}
          <Card discipline="reformer" variant="outlined">
            <View className="mb-sm h-1 w-12 rounded-full bg-reformer" />

            <Typography variant="h2">Reformer</Typography>

            <Typography variant="bodySmall" tone="muted" className="mt-xs">
              Strength & Control
            </Typography>
          </Card>
        </View>

        {/* BUTTON TEST ALANI */}
        <View className="mt-xl gap-md">
          <Typography variant="h2">Button Components</Typography>

          <Typography variant="bodySmall" tone="muted">
            Botanical Calm ortak buton sistemi
          </Typography>

          {/* Primary */}
          <Button
            label="Antrenmana Başla"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => Alert.alert('Başarılı', 'Primary buton çalışıyor.')}
          />

          {/* Secondary */}
          <Button
            label="Programı İncele"
            variant="secondary"
            fullWidth
            onPress={() => Alert.alert('Başarılı', 'Secondary buton çalışıyor.')}
          />

          {/* Outline */}
          <Button
            label="Daha Fazla"
            variant="outline"
            fullWidth
            onPress={() => Alert.alert('Başarılı', 'Outline buton çalışıyor.')}
          />

          {/* Ghost */}
          <Button
            label="Daha Sonra"
            variant="ghost"
            fullWidth
            onPress={() => Alert.alert('Başarılı', 'Ghost buton çalışıyor.')}
          />

          {/* Loading */}
          <Button label="Yükleniyor" variant="primary" loading fullWidth />

          {/* Disabled */}
          <Button label="Devre Dışı" variant="primary" disabled fullWidth />
        </View>

        {/* INPUT TEST ALANI */}
        <View className="mt-xl gap-md">
          <Typography variant="h2">Input Components</Typography>

          <Typography variant="bodySmall" tone="muted">
            Botanical Calm ortak form sistemi
          </Typography>

          {/* Ad Soyad */}
          <Input
            label="Ad Soyad"
            placeholder="Adınızı ve soyadınızı girin"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            helperText="Profilinizde görüntülenecek adınız."
          />

          {/* E-posta */}
          <Input
            label="E-posta"
            placeholder="ornek@email.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setShowEmailError(false);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            error={emailInvalid ? 'Geçerli bir e-posta adresi girin.' : undefined}
          />

          {/* Şifre */}
          <Input
            label="Şifre"
            placeholder="Şifrenizi girin"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            helperText="Şifreniz gizli tutulur."
          />

          {/* Devre dışı */}
          <Input label="Devre dışı" value="Düzenlenemez alan" disabled />

          {/* E-posta kontrol butonu */}
          <Button
            label="E-posta Kontrolü"
            variant="primary"
            fullWidth
            onPress={handleEmailValidation}
          />
        </View>
      </View>
    </ScrollView>
  );
}
