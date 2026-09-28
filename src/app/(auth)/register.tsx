import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { signUpWithEmail } from '@/features/auth/services/auth-service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateForm() {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setPasswordConfirmationError('');
    setAuthError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailError('E-posta adresini gir.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Geçerli bir e-posta adresi gir.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Şifre oluştur.');
      isValid = false;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı.`);
      isValid = false;
    }

    if (!passwordConfirmation) {
      setPasswordConfirmationError('Şifreni tekrar gir.');
      isValid = false;
    } else if (password !== passwordConfirmation) {
      setPasswordConfirmationError('Şifreler eşleşmiyor.');
      isValid = false;
    }

    return isValid;
  }

  async function handleRegister() {
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signUpWithEmail(email, password);

      if (error) {
        setAuthError(getRegisterErrorMessage(error.message));
      }
    } catch {
      setAuthError('Beklenmeyen bir hata oluştu. Lütfen tekrar dene.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-lg py-xl"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-full max-w-[480px]">
          <View className="mb-xl">
            <Typography variant="display">Hesabını oluştur</Typography>

            <Typography variant="body" tone="muted" className="mt-sm">
              Yoga, Pilates ve Reformer pratiğini kişiselleştirmek için hesabını oluştur.
            </Typography>
          </View>

          <View className="gap-lg">
            <Input
              label="E-posta"
              placeholder="ornek@email.com"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
                setAuthError('');
              }}
              error={emailError}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="next"
              editable={!isSubmitting}
            />

            <Input
              label="Şifre"
              placeholder="En az 8 karakter"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setPasswordError('');
                setAuthError('');
              }}
              error={passwordError}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="next"
              editable={!isSubmitting}
            />

            <Input
              label="Şifre tekrar"
              placeholder="Şifreni tekrar gir"
              value={passwordConfirmation}
              onChangeText={(value) => {
                setPasswordConfirmation(value);
                setPasswordConfirmationError('');
                setAuthError('');
              }}
              error={passwordConfirmationError}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={() => {
                void handleRegister();
              }}
              editable={!isSubmitting}
            />

            {authError ? (
              <Typography variant="bodySmall" tone="danger" accessibilityRole="alert">
                {authError}
              </Typography>
            ) : null}

            <Button
              label="Hesap Oluştur"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onPress={() => {
                void handleRegister();
              }}
            />
          </View>

          <View className="mt-xl flex-row items-center justify-center">
            <Typography variant="bodySmall" tone="muted">
              Zaten hesabın var mı?{' '}
            </Typography>

            <Link href="/(auth)/login" asChild>
              <Typography variant="label" tone="primary">
                Giriş yap
              </Typography>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getRegisterErrorMessage(message: string) {
  return message;
}
