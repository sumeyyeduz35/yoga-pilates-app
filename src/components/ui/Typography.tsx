import type { ReactNode } from 'react';
import { Text, type TextProps } from 'react-native';

export type TypographyVariant =
  'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'label' | 'caption';

export type TypographyTone = 'default' | 'muted' | 'subtle' | 'primary' | 'danger';

type TypographyProps = TextProps & {
  children: ReactNode;
  variant?: TypographyVariant;
  tone?: TypographyTone;
  className?: string;
};

const variantStyles: Record<TypographyVariant, string> = {
  display: 'font-manrope-bold text-3xl',
  h1: 'font-manrope-bold text-2xl',
  h2: 'font-manrope-bold text-xl',
  h3: 'font-manrope-semibold text-lg',
  body: 'font-manrope text-base',
  bodySmall: 'font-manrope text-sm',
  label: 'font-manrope-semibold text-sm',
  caption: 'font-manrope text-xs',
};

const toneStyles: Record<TypographyTone, string> = {
  default: 'text-text',
  muted: 'text-text-muted',
  subtle: 'text-text-subtle',
  primary: 'text-primary',
  danger: 'text-danger',
};

export function Typography({
  children,
  variant = 'body',
  tone = 'default',
  className = '',
  accessibilityRole,
  ...props
}: TypographyProps) {
  const isHeading = ['display', 'h1', 'h2', 'h3'].includes(variant);

  return (
    <Text
      {...props}
      accessibilityRole={accessibilityRole ?? (isHeading ? 'header' : undefined)}
      className={`${variantStyles[variant]} ${toneStyles[tone]} ${className}`}
    >
      {children}
    </Text>
  );
}
