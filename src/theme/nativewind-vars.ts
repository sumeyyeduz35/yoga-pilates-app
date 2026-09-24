
import { vars } from 'nativewind';

import { colorSchemes } from './color-schemes';

type Palette = typeof colorSchemes.light;

function createThemeVariables(colors: Palette) {
  return vars({
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-surface-muted': colors.surfaceMuted,

    '--color-primary': colors.primary,
    '--color-primary-soft': colors.primarySoft,
    '--color-accent': colors.accent,

    '--color-text': colors.text,
    '--color-text-muted': colors.textMuted,
    '--color-text-subtle': colors.textSubtle,

    '--color-border': colors.border,
    '--color-border-strong': colors.borderStrong,

    '--color-success': colors.success,
    '--color-warning': colors.warning,
    '--color-danger': colors.danger,
    '--color-overlay': colors.overlay,

    '--color-yoga': colors.yoga,
    '--color-yoga-soft': colors.yogaSoft,

    '--color-pilates': colors.pilates,
    '--color-pilates-soft': colors.pilatesSoft,

    '--color-reformer': colors.reformer,
    '--color-reformer-soft': colors.reformerSoft,
  });
}

export const themeVariables = {
  light: createThemeVariables(colorSchemes.light),
  dark: createThemeVariables(colorSchemes.dark),
};