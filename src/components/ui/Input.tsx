import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { Typography } from '@/components/ui/Typography';
import { useTheme } from '@/providers/theme-provider';

// Input bileşeninin özellikleri
export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function Input({
  label,
  helperText,
  error,
  disabled = false,
  editable = true,
  className = '',
  placeholder,
  accessibilityLabel,
  onFocus,
  onBlur,
  style,
  ...rest
}: InputProps) {
  const { colors } = useTheme();

  const [focused, setFocused] = useState(false);

  // Alanın düzenlenebilirlik durumu
  const isDisabled = disabled || !editable;

  // Dinamik kenarlık rengi
  const borderColor = error
    ? colors.danger
    : focused && !isDisabled
      ? colors.primary
      : colors.border;

  return (
    <View className="w-full">
      {/* Alan etiketi */}
      {label && (
        <Typography variant="label" className="mb-sm">
          {label}
        </Typography>
      )}

      {/* Metin giriş alanı */}
      <TextInput
        {...rest}
        editable={!isDisabled}
        accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
        accessibilityState={{
          disabled: isDisabled,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textSubtle}
        selectionColor={colors.primary}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={[
          'min-h-[52px] rounded-md border',
          'bg-surface px-md py-sm',
          'font-manrope text-base text-text',
          isDisabled ? 'opacity-50' : '',
          className,
        ].join(' ')}
        style={[
          {
            borderColor,
          },
          style,
        ]}
      />

      {/* Hata mesajı veya yardımcı açıklama */}
      {error ? (
        <Typography variant="caption" tone="danger" className="mt-xs">
          {error}
        </Typography>
      ) : helperText ? (
        <Typography variant="caption" tone="muted" className="mt-xs">
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
}
