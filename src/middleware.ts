import type { NextRequest } from 'next/server';

import { geolocation } from '@vercel/functions';
import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { BUILD_APP_NAME } from './consts/env';

import { localePrefix, locales } from './i18n/request';
import { BUILD_APP_NAMES } from './types';

export const ROUTE_PATTERNS: Record<string, BUILD_APP_NAMES[]> = {
  '/trade': [BUILD_APP_NAMES.KODIAK, BUILD_APP_NAMES.PANCAKESWAP, BUILD_APP_NAMES.BERACHAIN_TESTNET],
};

function matchRoute(path: string): string | null {
  const segments = path.split('/').filter(Boolean);
  if (segments[0] && locales.includes(segments[0])) {
    segments.shift();
  }
  const routeToCheck = '/' + segments.join('/');

  for (const pattern in ROUTE_PATTERNS) {
    if (routeToCheck.startsWith(pattern)) {
      return pattern;
    }
  }
  return null;
}

const BLOCKED_COUNTRIES_ALPHA_2_CODES: string[] = [
  'ZW',
  'YE',
  'CU',
  'IR',
  'KP',
  'SY',
  'BY',
  'MM',
  'CF',
  'CD',
  'ET',
  'IQ',
  'LB',
  'LY',
  'SD',
  'VE',
];

const unblockedUserAgents = ['Twitter', 'Telegram', 'Discord', 'Google', 'Go-http-client'];

export default async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');

  if (!['/', '/en'].includes(request.nextUrl.pathname)) {
    let check = false;

    if (userAgent) {
      for (let i = 0; i < unblockedUserAgents.length; i++) {
        const unblockedUserAgent = unblockedUserAgents[i]!;

        if (userAgent.includes(unblockedUserAgent)) {
          check = false;
          break;
        }
        check = true;
      }
    }

    if (check) {
      const { country } = geolocation(request);

      if (country && BLOCKED_COUNTRIES_ALPHA_2_CODES.includes(country)) {
        request.nextUrl.pathname = '/blocked';

        return NextResponse.rewrite(request.nextUrl);
      }
    }

    if (BUILD_APP_NAME !== BUILD_APP_NAMES.STRYKE) {
      const path = request.nextUrl.pathname;
      const matchedPattern = matchRoute(path);

      if (!matchedPattern || !ROUTE_PATTERNS[matchedPattern].includes(BUILD_APP_NAME)) {
        request.nextUrl.pathname = '/404';
        return NextResponse.rewrite(request.nextUrl);
      }
    }
  }

  const handleI18nRouting = createIntlMiddleware({
    locales,
    // Used when no locale matches
    defaultLocale: 'en',
    localePrefix,
  });

  return handleI18nRouting(request);
}

// update to this after we have localization support for all languages
// '/(en|de|es|vi|zh-CN)/:path*',

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|changelog|blocked|.*\\..*).*)',
  ],
};
