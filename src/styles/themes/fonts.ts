import { Open_Sans, Outfit } from 'next/font/google';
import localFont from 'next/font/local';

import { FONTS } from './consts';

import { DEFAULT_THEME_CONFIG } from '.';

const aeonikPro = localFont({
  src: [
    { path: '../../assets/fonts/AeonikPro/AeonikPro-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../assets/fonts/AeonikPro/AeonikPro-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/AeonikPro/AeonikPro-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/AeonikPro/AeonikPro-Bold.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--fonts-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonts-sans',
});

const ppSupplyMono = localFont({
  src: '../../assets/fonts/PPSupply/PPSupplyMono-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--fonts-mono',
});

const kanit = localFont({
  src: [
    { path: '../../assets/fonts/Kanit/Kanit-Thin.ttf', weight: '300', style: 'normal' },
    { path: '../../assets/fonts/Kanit/Kanit-Light.ttf', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/Kanit/Kanit-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/Kanit/Kanit-Regular.ttf', weight: '600', style: 'normal' },
    { path: '../../assets/fonts/Kanit/Kanit-SemiBold.ttf', weight: '700', style: 'normal' },
    { path: '../../assets/fonts/Kanit/Kanit-Bold.ttf', weight: '800', style: 'normal' },
  ],
  weight: '400',
  display: 'swap',
  variable: '--fonts-sans',
});

export const openSansFont = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fonts-open-sans',
});

export const sansFont = (() => {
  switch (DEFAULT_THEME_CONFIG.fonts.sans) {
    case FONTS.AEONIK_PRO:
      return aeonikPro;
    case FONTS.OUTFIT:
      return outfit;
    case FONTS.KANIT:
      return kanit;
    default:
      return null;
  }
})();

export const monoFont = (() => {
  switch (DEFAULT_THEME_CONFIG.fonts.mono) {
    case FONTS.PP_SUPPLY_MONO:
      return ppSupplyMono;
    default:
      return null;
  }
})();
