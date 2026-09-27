import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/providers/theme-provider';

export type CardVariant = 'default' | 'outlined' | 'elevated';

export type CardDiscipline = 'yoga' | 'pilates' | 'reformer';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

type CardProps = Omit<ViewProps, 'children'> & {
  children: ReactNode;
  variant?: CardVariant;
  discipline?: CardDiscipline;
  padding?: CardPadding;
  className?: string;
};

const variantStyles: Record<CardVariant, string> = {
  default: '',
  outlined: 'border border-border',
  elevated: '',
};

const disciplineStyles: Record<CardDiscipline, string> = {
  yoga: 'bg-yoga-soft',
  pilates: 'bg-pilates-soft',
  reformer: 'bg-reformer-soft',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg',
};

export function Card({
  children,
  variant = 'default',
  discipline,
  padding = 'md',
  className = '',
  style,
  ...props
}: CardProps) {
  const { colors } = useTheme();

  const elevated = variant === 'elevated';

  return (
    <View
      {...props}
      className={[
        'rounded-lg',
        variantStyles[variant],
        discipline ? disciplineStyles[discipline] : 'bg-surface',
        paddingStyles[padding],
        className,
      ].join(' ')}
      style={[
        elevated
          ? {
              shadowColor: colors.text,
              shadowOpacity: 0.08,
              shadowRadius: 12,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              elevation: 3,
            }
          : undefined,
        style,
      ]}
    >
      {children}
    </View>
  );
}
