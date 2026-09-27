import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';

import { useTheme } from '@/providers/theme-provider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary border border-transparent',
  secondary: 'bg-primary-soft border border-transparent',
  outline: 'bg-transparent border border-border-strong',
  ghost: 'bg-transparent border border-transparent',
};

const textStyles: Record<ButtonVariant, string> = {
  primary: 'text-surface',
  secondary: 'text-primary',
  outline: 'text-text',
  ghost: 'text-primary',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'min-h-[44px] px-md py-sm',
  md: 'min-h-[48px] px-lg py-sm',
  lg: 'min-h-[56px] px-xl py-md',
};

const textSizeStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  accessibilityLabel,
  accessibilityState,
  ...props
}: ButtonProps) {
  const { colors } = useTheme();

  const isDisabled = disabled || loading;

  const spinnerColor = variant === 'primary' ? colors.surface : colors.primary;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={loading ? `${label}, yükleniyor` : (accessibilityLabel ?? label)}
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled,
        busy: loading,
      }}
      className={[
        'flex-row items-center justify-center gap-sm rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
        className,
      ].join(' ')}
      style={({ pressed }) => ({
        opacity: pressed && !isDisabled ? 0.85 : 1,
      })}
    >
      {loading && <ActivityIndicator size="small" color={spinnerColor} />}

      <Text
        className={[
          'font-manrope-semibold text-center',
          textStyles[variant],
          textSizeStyles[size],
        ].join(' ')}
      >
        {label}
      </Text>
    </Pressable>
  );
}
