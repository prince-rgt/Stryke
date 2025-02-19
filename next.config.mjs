import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';

const BUILD_APP_NAME = process.env.NEXT_PUBLIC_BUILD_APP_NAME || 'STRYKE';

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'",
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(); battery=();  browsing-topics=(); geolocation=(); microphone=()',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
];

const APP_REDIRECT_REWRITE_CONFIG = {
  STRYKE: {
    rewrites:
      process.env.VERCEL_ENV === 'production'
        ? [{ source: '/en', destination: 'https://aware-objects-660258.framer.app/' }]
        : [],
    redirects:
      process.env.VERCEL_ENV !== 'production'
        ? [{ source: '/en', destination: '/en/dashboard', permanent: false }]
        : [],
  },
  KODIAK: {
    rewrites: [],
    redirects: [{ source: '/en', destination: '/en/trade', permanent: false }],
  },
  PANCAKESWAP: {
    rewrites: [],
    redirects: [{ source: '/en', destination: '/en/trade', permanent: false }],
  },
  BERACHAIN_TESTNET: {
    rewrites: [],
    redirects: [{ source: '/en', destination: '/en/trade', permanent: false }],
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  async rewrites() {
    return APP_REDIRECT_REWRITE_CONFIG[BUILD_APP_NAME].rewrites;
  },
  async redirects() {
    return APP_REDIRECT_REWRITE_CONFIG[BUILD_APP_NAME].redirects;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'stryke',
  project: 'swordfish-ii',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  autoInstrumentServerFunctions: false,
  autoInstrumentMiddleware: false,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
