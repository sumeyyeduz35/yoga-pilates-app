import tokens from './tokens.json';

export const disciplineTheme = {
  yoga: {
    label: 'Yoga',
    color: tokens.colors.yoga,
    softColor: tokens.colors.yogaSoft,
  },
  pilates: {
    label: 'Pilates',
    color: tokens.colors.pilates,
    softColor: tokens.colors.pilatesSoft,
  },
  reformer: {
    label: 'Reformer',
    color: tokens.colors.reformer,
    softColor: tokens.colors.reformerSoft,
  },
} as const;

export type DisciplineKey = keyof typeof disciplineTheme;
