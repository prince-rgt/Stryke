import { BUILD_APP_NAMES } from '@/types';

import { BUILD_APP_NAME } from './env';

const OPEN_GRAPH_BASE_DATA_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: {
    siteName: 'Stryke',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dxitdndu3/image/upload/f_auto,q_auto/v1/stryke_images/opengraph/xwafhduooeyxeetgpuuj',
        width: 1026,
        height: 538,
        alt: 'Stryke / Maximum reward Minimal risk',
      },
    ],
  },
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: {
    siteName: 'Stryke',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dxitdndu3/image/upload/f_auto,q_auto/v1/stryke_images/opengraph/xwafhduooeyxeetgpuuj',
        width: 1026,
        height: 538,
        alt: 'Stryke / Maximum reward Minimal risk',
      },
    ],
  },
  [BUILD_APP_NAMES.KODIAK]: {
    siteName: 'Boptions',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/dxitdndu3/image/upload/v1727954644/Kodiak_Bear-Inverse-Logo_uvpdff.webp',
        width: 900,
        height: 1024,
        alt: 'Boptions / Maximum reward Minimal risk',
      },
    ],
  },
  [BUILD_APP_NAMES.PANCAKESWAP]: {
    siteName: 'Pancake',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://assets.pancakeswap.finance/web/og/v2/hero.jpg',
        width: 1026,
        height: 538,
        alt: '🥞 PancakeSwap Options | ⚡️ Powered by Stryke',
      },
    ],
  },
};

export const OPEN_GRAPH_BASE_DATA = OPEN_GRAPH_BASE_DATA_BY_BUILD_APP[BUILD_APP_NAME];
