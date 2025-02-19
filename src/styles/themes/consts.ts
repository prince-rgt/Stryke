import { BUILD_APP_NAMES } from '@/types';

import { BUILD_APP_NAME } from '@/consts/env';

import { ThemeConfig } from './types';

const STRYKE_COLORS = {
  'primary-panel': 'hsl(0 0% 7.8%)',
  'secondary-panel': 'hsl(0 0% 12.5%)',
  'dark-grey': 'hsl(0 0% 17.3%)',
  grey: 'hsl(0 0% 23.5%)',
  'light-grey': 'hsl(0 0% 43.5%)',
  'light-stryke': 'hsl(65 100% 70.6%)',
  blue: 'hsl(184 87% 60.6%)',
  'light-blue': 'hsl(184 100% 83.7%)',
  green: 'hsl(155 87% 51.2%)',
  'light-green': 'hsl(155 100% 76.3%)',
  red: 'hsl(345 93% 58.4%)',
  'light-red': 'hsl(346 100% 72%)',
  yellow: 'hsl(65 100% 50%)',
};

const KODIAK_COLORS = {
  'header-blue': 'hsl(228 33% 7%)',
  'accent-blue': 'hsl(210 100% 60%)', // A more saturated blue for accents
  'deep-navy': 'hsl(228 33% 12%)', // #161B2F
  navy: 'hsl(228 33% 15%)', // #1C2239
  'light-navy': 'hsl(228 33% 18%)', // #222843
  white: 'hsl(0 0% 100%)', // #FFFFFF
  'off-white': 'hsl(0 0% 95%)', // #F2F2F2
  black: 'hsl(0 0% 11%)', // #1C1C1C
  yellow: 'hsl(45 100% 60%)', // Slightly muted yellow
  gray: {
    100: 'hsl(228 33% 95%)', // #F2F3F6
    200: 'hsl(228 33% 90%)', // #E5E7ED
    300: 'hsl(228 33% 80%)', // #CCD0DB
    400: 'hsl(228 33% 60%)', // #9AA1B8
    500: 'hsl(228 33% 40%)', // #676E85
  },
};

const PCS_COLORS = {
  'bg-primary': 'hsl(257 18% 29%)',
  'bg-secondary': 'hsl(264 20% 14%)',
  'bg-tertiary': 'hsl(260 18% 20%)',
  'bg-tertiary-alt': 'hsl(260 18% 20%)',
  'bg-quaternary': 'hsl(260 17% 25%)',
  'bg-success': 'hsl(165 64% 50%)',
  'bg-field-primary': 'hsl(261 18% 16%)',
  // texts
  'texts-primary': 'hsl(261 100% 97%)',
  'texts-secondary': 'hsl(261 33% 75%)',
  'texts-tertiary': 'hsl(263 17% 53%)',
  // accents
  'accents-success': 'hsl(165 73% 55%)',
  'accents-teal': 'hsl(182 88% 55%)',
  'accents-teal-secondary': 'hsla(182 88% 55% 0.6)',
  'accents-purple': 'hsl(262 100% 75%)',
  'accents-danger': 'hsl(327 100% 69%)',
  // bg
  'bubblegum-top': 'hsl(227 31% 28%)',
  'bubblegum-bottom': 'hsl(272 33% 25%)',

  'borders-primary': 'hsl(257 18% 29%)',
  'borders-secondary': 'hsl(260 18% 20%)',
  'borders-quaternary': 'hsl(260 17% 27%)',
  gray: {
    100: 'hsl(228 33% 95%)', // #F2F3F6
    200: 'hsl(228 33% 90%)', // #E5E7ED
    300: 'hsl(228 33% 80%)', // #CCD0DB
    400: 'hsl(228 33% 60%)', // #9AA1B8
    500: 'hsl(228 33% 40%)', // #676E85
  },
};

// use enum for loaded fonts
export enum FONTS {
  AEONIK_PRO = 'Aeonic Pro',
  PP_SUPPLY_MONO = 'PP Supply Mono',
  OPEN_SANS = 'Open Sans',
  OUTFIT = 'Outfit',
  KANIT = 'Kanit',
}

export const BASE_CONFIG = {
  borderRadius: {
    custom: '0px',
    sm: '2px',
    md: '13px',
    lg: '18px',
  },
  spacing: {
    xs: '1px',
    sm: '3px',
    md: '11px',
    lg: '15px',
  },
  fonts: {
    sans: FONTS.AEONIK_PRO,
    mono: FONTS.PP_SUPPLY_MONO,
  },
};

const lightTheme: ThemeConfig = {
  ...BASE_CONFIG,
  colors: {
    background: 'hsl(0 0% 98%)', // Very light background for a clean look
    foreground: 'hsl(0 0% 10%)', // Dark text for good readability
    card: {
      DEFAULT: 'hsl(0 0% 100%)',
      foreground: 'hsl(0 0% 10%)',
    },
    popover: {
      DEFAULT: 'hsl(0 0% 98%)',
      foreground: 'hsl(0 0% 10%)',
    },
    primary: {
      DEFAULT: 'hsl(0 0% 96%)',
      foreground: 'hsl(0 0% 10%)',
    },
    secondary: {
      DEFAULT: 'hsl(0 0% 93%)',
      foreground: 'hsl(0 0% 20%)',
    },
    selected: {
      DEFAULT: 'hsl(0 0% 90%)',
      foreground: 'hsl(0 0% 10%)',
    },
    active: {
      DEFAULT: 'hsl(0 0% 96%)',
      foreground: 'hsl(0 0% 10%)',
    },
    subtle: {
      DEFAULT: 'hsl(0 0% 85%)',
      foreground: 'hsl(0 0% 30%)',
    },
    muted: {
      DEFAULT: 'hsl(0 0% 95%)',
      foreground: 'hsl(0 0% 50%)',
    },
    accent: {
      DEFAULT: STRYKE_COLORS.blue,
      foreground: 'hsl(0 0% 100%)',
    },
    success: {
      DEFAULT: STRYKE_COLORS.green,
      light: STRYKE_COLORS['light-green'],
      foreground: 'hsl(0 0% 100%)',
    },
    destructive: {
      DEFAULT: STRYKE_COLORS.red,
      light: STRYKE_COLORS['light-red'],
      foreground: 'hsl(0 0% 100%)',
    },
    highlight: STRYKE_COLORS.yellow,
    border: 'hsl(0 0% 80%)',
    input: 'hsl(0 0% 90%)',
    ring: 'hsl(0 0% 60%)',
  },
};

const darkTheme: ThemeConfig = {
  ...BASE_CONFIG,
  colors: {
    background: 'hsl(0 0% 0%)',
    foreground: 'hsl(0 0% 100%)',
    card: {
      DEFAULT: STRYKE_COLORS['primary-panel'],
      foreground: 'hsl(0 0% 100%)',
    },
    popover: {
      DEFAULT: 'hsl(0 0% 0%)',
      foreground: 'hsl(0 0% 100%)',
    },
    primary: {
      DEFAULT: STRYKE_COLORS['primary-panel'],
      foreground: 'hsl(0 0% 0%)',
    },
    secondary: {
      DEFAULT: STRYKE_COLORS['secondary-panel'],
      foreground: 'hsl(0 0% 0%)',
    },
    selected: {
      DEFAULT: STRYKE_COLORS['dark-grey'],
      foreground: 'hsl(0 0% 100%)',
    },
    active: {
      DEFAULT: STRYKE_COLORS['primary-panel'],
      foreground: 'hsl(0 0% 0%)',
    },
    subtle: {
      DEFAULT: STRYKE_COLORS['light-grey'],
      foreground: 'hsl(0 0% 100%)',
    },
    muted: {
      DEFAULT: STRYKE_COLORS.grey,
      foreground: STRYKE_COLORS['light-grey'],
    },
    accent: {
      DEFAULT: STRYKE_COLORS['light-stryke'],
      foreground: 'hsl(0 0% 0%)',
    },
    success: {
      DEFAULT: STRYKE_COLORS.green,
      light: STRYKE_COLORS['light-green'],
      foreground: 'hsl(0 0% 0%)',
    },
    destructive: {
      DEFAULT: STRYKE_COLORS.red,
      light: STRYKE_COLORS['light-red'],
      foreground: 'hsl(0 0% 0%)',
    },
    highlight: STRYKE_COLORS.yellow,
    border: STRYKE_COLORS['light-grey'],
    input: STRYKE_COLORS.grey,
    ring: STRYKE_COLORS['light-green'],
  },
};

const kodaikDarkTheme: ThemeConfig = {
  ...BASE_CONFIG,
  fonts: {
    sans: FONTS.OUTFIT,
    mono: FONTS.PP_SUPPLY_MONO,
  },
  colors: {
    background: KODIAK_COLORS['deep-navy'],
    foreground: KODIAK_COLORS['off-white'],
    card: {
      DEFAULT: KODIAK_COLORS['navy'],
      foreground: KODIAK_COLORS['off-white'],
    },
    popover: {
      DEFAULT: KODIAK_COLORS['light-navy'],
      foreground: KODIAK_COLORS['off-white'],
    },
    primary: {
      DEFAULT: KODIAK_COLORS['header-blue'],
      foreground: KODIAK_COLORS['deep-navy'],
    },
    secondary: {
      DEFAULT: KODIAK_COLORS['light-navy'],
      foreground: KODIAK_COLORS['off-white'],
    },
    selected: {
      DEFAULT: KODIAK_COLORS['accent-blue'],
      foreground: KODIAK_COLORS.white,
    },
    active: {
      DEFAULT: KODIAK_COLORS['header-blue'],
      foreground: KODIAK_COLORS['deep-navy'],
    },
    subtle: {
      DEFAULT: KODIAK_COLORS.gray[500],
      foreground: KODIAK_COLORS.gray[200],
    },
    muted: {
      DEFAULT: KODIAK_COLORS.gray[400],
      foreground: KODIAK_COLORS.gray[100],
    },
    accent: {
      DEFAULT: KODIAK_COLORS['accent-blue'],
      foreground: KODIAK_COLORS.white,
    },
    success: {
      DEFAULT: 'hsl(152 76% 40%)',
      light: 'hsl(152 76% 50%)',
      foreground: KODIAK_COLORS.white,
    },
    destructive: {
      DEFAULT: 'hsl(0 84% 60%)',
      light: 'hsl(0 84% 70%)',
      foreground: KODIAK_COLORS.white,
    },
    highlight: KODIAK_COLORS.yellow,
    border: KODIAK_COLORS.gray[500],
    input: KODIAK_COLORS['light-navy'],
    ring: KODIAK_COLORS['accent-blue'],
  },
};

const pcsDarkTheme: ThemeConfig = {
  ...BASE_CONFIG,
  fonts: {
    sans: FONTS.KANIT,
    mono: FONTS.PP_SUPPLY_MONO,
  },
  colors: {
    background: PCS_COLORS['bubblegum-top'],
    foreground: PCS_COLORS['texts-primary'],
    card: {
      DEFAULT: PCS_COLORS['bg-tertiary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    popover: {
      DEFAULT: PCS_COLORS['bg-primary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    primary: {
      DEFAULT: PCS_COLORS['bg-secondary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    secondary: {
      DEFAULT: PCS_COLORS['bg-field-primary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    selected: {
      DEFAULT: PCS_COLORS['bg-tertiary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    active: {
      DEFAULT: PCS_COLORS['bg-tertiary'],
      foreground: PCS_COLORS['texts-primary'],
    },
    subtle: {
      DEFAULT: PCS_COLORS['texts-secondary'],
      foreground: PCS_COLORS['accents-danger'],
    },
    muted: {
      DEFAULT: PCS_COLORS['bg-primary'],
      foreground: PCS_COLORS['texts-secondary'],
    },
    accent: {
      DEFAULT: PCS_COLORS['accents-purple'],
      foreground: PCS_COLORS['texts-primary'],
    },
    success: {
      DEFAULT: PCS_COLORS['accents-success'],
      light: 'hsl(152 76% 50%)',
      foreground: PCS_COLORS['texts-primary'],
    },
    destructive: {
      DEFAULT: PCS_COLORS['accents-danger'],
      light: 'hsl(0 84% 70%)',
      foreground: PCS_COLORS['texts-primary'],
    },
    highlight: PCS_COLORS['accents-success'],
    border: PCS_COLORS['borders-secondary'],
    input: PCS_COLORS['borders-secondary'],
    ring: PCS_COLORS['accents-purple'],
  },
  borderRadius: {
    custom: '24px',
    sm: '6px',
    md: '13px',
    lg: '18px',
  },
  spacing: {
    xs: '12px',
    sm: '8px',
    md: '14px',
    lg: '16px',
  },
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
  kodaikDark: kodaikDarkTheme,
  pcsDark: pcsDarkTheme,
};

const APP_TO_THEME_MAPPING = {
  [BUILD_APP_NAMES.KODIAK]: 'kodaikDark',
  [BUILD_APP_NAMES.PANCAKESWAP]: 'pcsDark',
  [BUILD_APP_NAMES.STRYKE]: 'dark',
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: 'dark',
};

const DEFAULT_THEME = APP_TO_THEME_MAPPING[BUILD_APP_NAME] as keyof typeof themes;

export { STRYKE_COLORS, themes, DEFAULT_THEME };
