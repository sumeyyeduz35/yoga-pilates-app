const tokens = require('./src/theme/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: tokens.colors.background,
        surface: tokens.colors.surface,
        primary: tokens.colors.primary,
        'primary-soft': tokens.colors.primarySoft,
        accent: tokens.colors.accent,
        text: tokens.colors.text,
        'text-muted': tokens.colors.textMuted,
        border: tokens.colors.border,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        danger: tokens.colors.danger,
      },
      spacing: {
        xs: `${tokens.spacing.xs}px`,
        sm: `${tokens.spacing.sm}px`,
        md: `${tokens.spacing.md}px`,
        lg: `${tokens.spacing.lg}px`,
        xl: `${tokens.spacing.xl}px`,
        '2xl': `${tokens.spacing['2xl']}px`,
      },
      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
        full: `${tokens.radius.full}px`,
      },
      fontSize: {
        xs: `${tokens.fontSize.xs}px`,
        sm: `${tokens.fontSize.sm}px`,
        base: `${tokens.fontSize.base}px`,
        lg: `${tokens.fontSize.lg}px`,
        xl: `${tokens.fontSize.xl}px`,
        '2xl': `${tokens.fontSize['2xl']}px`,
        '3xl': `${tokens.fontSize['3xl']}px`,
      },
    },
  },
  plugins: [],
};
