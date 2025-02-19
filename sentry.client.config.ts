// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://4c28cff36092da0b66f4f4f1a8380be6@o4507340202311680.ingest.de.sentry.io/4507686173081680',

  autoSessionTracking: false,

  tracesSampleRate: 1,

  beforeSend: (event, hint) => {
    // console.log({ event, hint });

    if (event.fingerprint?.includes('transaction_error')) {
      return event;
    }
    return null;
  },

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // replaysOnErrorSampleRate: 1.0,

  // // This sets the sample rate to be 10%. You may want this to be 100% while
  // // in development and sample at a lower rate in production
  // replaysSessionSampleRate: 0.1,

  // // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  // integrations: [
  //   Sentry.replayIntegration({
  //     // Additional Replay configuration goes in here, for example:
  //     maskAllText: true,
  //     blockAllMedia: true,
  //   }),
  // ],
});
