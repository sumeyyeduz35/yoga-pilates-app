
import tokens from './tokens.json';

export const colorSchemes = {
  light: tokens.colors,

  dark: {
    ...tokens.colors,

    background: '#121A17',
    surface: '#1C2722',
    surfaceMuted: '#26342D',

    primary: '#A4C8B8',
    primarySoft: '#294238',
    accent: '#E3B89B',

    text: '#F3F7F4',
    textMuted: '#BDCBC3',
    textSubtle: '#91A69A',

    border: '#37473F',
    borderStrong: '#54685C',

    success: '#87CAA0',
    warning: '#E6BA7D',
    danger: '#E89B9B',

    overlay: 'rgba(0,0,0,0.65)',

    yoga: '#9BC1AD',
    yogaSoft: '#293F33',

    pilates: '#E0B099',
    pilatesSoft: '#46352C',

    reformer: '#A5BECD',
    reformerSoft: '#2B3D48',
  } satisfies typeof tokens.colors,
};

export type ColorSchemeName = keyof typeof colorSchemes;