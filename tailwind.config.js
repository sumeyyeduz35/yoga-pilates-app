
const tokens = require('./src/theme/tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',

        primary: 'var(--color-primary)',
        'primary-soft': 'var(--color-primary-soft)',
        accent: 'var(--color-accent)',

        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        'text-subtle': 'var(--color-text-subtle)',

        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        overlay: 'var(--color-overlay)',

        yoga: 'var(--color-yoga)',
        'yoga-soft': 'var(--color-yoga-soft)',

        pilates: 'var(--color-pilates)',
        'pilates-soft': 'var(--color-pilates-soft)',

        reformer: 'var(--color-reformer)',
        'reformer-soft': 'var(--color-reformer-soft)',
      },

      spacing: {
        xs: `${tokens.spacing.xs}px`,
        sm: `${tokens.spacing.sm}px`,
        md: `${tokens.spacing.md}px`,
        lg: `${tokens.spacing.lg}px`,
        xl: `${tokens.spacing.xl}px`,
        '2xl': `${tokens.spacing['2xl']}px`,
        '3xl': `${tokens.spacing['3xl']}px`,
        '4xl': `${tokens.spacing['4xl']}px`,
      },

      borderRadius: {
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
        '2xl': `${tokens.radius['2xl']}px`,
        full: `${tokens.radius.full}px`,
      },

      fontFamily: {
        manrope: [tokens.fontFamily.regular],
        'manrope-medium': [tokens.fontFamily.medium],
        'manrope-semibold': [tokens.fontFamily.semibold],
        'manrope-bold': [tokens.fontFamily.bold],
      },

      fontSize: {
        xs: [
          `${tokens.fontSize.xs}px`,
          { lineHeight: `${tokens.lineHeight.xs}px` },
        ],
        sm: [
          `${tokens.fontSize.sm}px`,
          { lineHeight: `${tokens.lineHeight.sm}px` },
        ],
        base: [
          `${tokens.fontSize.base}px`,
          { lineHeight: `${tokens.lineHeight.base}px` },
        ],
        lg: [
          `${tokens.fontSize.lg}px`,
          { lineHeight: `${tokens.lineHeight.lg}px` },
        ],
        xl: [
          `${tokens.fontSize.xl}px`,
          { lineHeight: `${tokens.lineHeight.xl}px` },
        ],
        '2xl': [
          `${tokens.fontSize['2xl']}px`,
          { lineHeight: `${tokens.lineHeight['2xl']}px` },
        ],
        '3xl': [
          `${tokens.fontSize['3xl']}px`,
          { lineHeight: `${tokens.lineHeight['3xl']}px` },
        ],
      },

      letterSpacing: {
        tight: `${tokens.letterSpacing.tight}px`,
        normal: `${tokens.letterSpacing.normal}px`,
        wide: `${tokens.letterSpacing.wide}px`,
      },
    },
  },

  plugins: [],
};