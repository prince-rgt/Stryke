import { GoogleAnalytics } from '@next/third-parties/google';

import { InitialTheme } from '@/styles/themes';

import '@/styles/globals.css';

import { BUILD_APP_NAMES } from '@/types';

import { BUILD_APP_NAME } from '@/consts/env';

import { monoFont, openSansFont, sansFont } from '@/styles/themes/fonts';

const ICON_HREF_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: '/images/brand/logo.ico',
  [BUILD_APP_NAMES.KODIAK]: '/images/brand/kodiak/logo.ico',
  [BUILD_APP_NAMES.PANCAKESWAP]: '/images/brand/pcs/logo.ico',
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: '/images/brand/logo.ico',
};
const ICON_HREF = ICON_HREF_BY_BUILD_APP[BUILD_APP_NAME];

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale && 'en'} className={`${sansFont?.variable} ${openSansFont.variable} ${monoFont?.variable}`}>
      <head>
        <link rel="icon" href={ICON_HREF} type="image/ico" />
        <InitialTheme />
      </head>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-22FS0TYJP4" />
    </html>
  );
}
