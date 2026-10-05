import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { signInWithEmail } from '@/features/auth/services/auth-service';

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    emailError,
    setEmailError,
  ] = useState('');

  const [
    passwordError,
    setPasswordError,
  ] = useState('');

  const [
    authError,
    setAuthError,
  ] = useState('');

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  function validateForm() {
    let isValid = true;

    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const normalizedEmail =
      email.trim();

    if (!normalizedEmail) {
      setEmailError(
        'E-posta adresini gir.',
      );

      isValid = false;
    } else if (
      !EMAIL_REGEX.test(
        normalizedEmail,
      )
    ) {
      setEmailError(
        'Geçerli bir e-posta adresi gir.',
      );

      isValid = false;
    }

    if (!password) {
      setPasswordError(
        'Şifreni gir.',
      );

      isValid = false;
    }

    return isValid;
  }

  async function handleLogin() {
    if (
      !validateForm() ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data,
        error,
      } = await signInWithEmail(
        email,
        password,
      );

      console.log(
        '[AUTH LOGIN DATA]',
        data,
      );

      if (error) {
        console.error(
          '[AUTH LOGIN ERROR]',
          {
            message:
              error.message,
            status:
              error.status,
            name:
              error.name,
          },
        );

        setAuthError(
          getLoginErrorMessage(
            error.message,
          ),
        );

        return;
      }

      console.log(
        '[AUTH LOGIN SUCCESS]',
        data.user?.email,
      );
    } catch (error) {
      console.error(
        '[AUTH LOGIN UNEXPECTED ERROR]',
        error,
      );

      setAuthError(
        'Beklenmeyen bir hata oluştu. Lütfen tekrar dene.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-lg py-xl"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-full max-w-[480px]">
          <View className="mb-xl">
            <Typography variant="display">
              Tekrar hoş geldin
            </Typography>

            <Typography
              variant="body"
              tone="muted"
              className="mt-sm"
            >
              Pratiğine kaldığın yerden
              devam etmek için hesabına
              giriş yap.
            </Typography>
          </View>

          <View className="gap-lg">
            <Input
              label="E-posta"
              placeholder="ornek@email.com"
              value={email}
              onChangeText={(
                value,
              ) => {
                setEmail(value);

                if (
                  emailError
                ) {
                  setEmailError(
                    '',
                  );
                }

                if (
                  authError
                ) {
                  setAuthError(
                    '',
                  );
                }
              }}
              error={
                emailError
              }
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="next"
              editable={
                !isSubmitting
              }
            />

            <Input
              label="Şifre"
              placeholder="Şifreni gir"
              value={password}
              onChangeText={(
                value,
              ) => {
                setPassword(
                  value,
                );

                if (
                  passwordError
                ) {
                  setPasswordError(
                    '',
                  );
                }

                if (
                  authError
                ) {
                  setAuthError(
                    '',
                  );
                }
              }}
              error={
                passwordError
              }
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={() => {
                void handleLogin();
              }}
              editable={
                !isSubmitting
              }
            />

            {authError ? (
              <Typography
                variant="bodySmall"
                tone="danger"
                accessibilityRole="alert"
              >
                {authError}
              </Typography>
            ) : null}

            <Button
              label="Giriş Yap"
              size="lg"
              fullWidth
              loading={
                isSubmitting
              }
              onPress={() => {
                void handleLogin();
              }}
            />
          </View>

          <View className="mt-xl flex-row items-center justify-center">
            <Typography
              variant="bodySmall"
              tone="muted"
            >
              Henüz hesabın yok mu?{' '}
            </Typography>

            <Link
              href="/(auth)/register"
              asChild
            >
              <Typography
                variant="label"
                tone="primary"
              >
                Hesap oluştur
              </Typography>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getLoginErrorMessage(
  message: string,
) {
  const normalizedMessage =
    message.toLowerCase();

  if (
    normalizedMessage.includes(
      'invalid login credentials',
    )
  ) {
    return 'E-posta adresi veya şifre hatalı.';
  }

  if (
    normalizedMessage.includes(
      'email not confirmed',
    )
  ) {
    return 'Giriş yapmadan önce e-posta adresini doğrulaman gerekiyor.';
  }

  return `Giriş hatası: ${message}`;
}