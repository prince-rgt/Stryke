import type { Metadata } from 'next';
import { BUILD_APP_NAMES } from '@/types';

import { BUILD_APP_NAME } from '@/consts/env';
import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

const METADATA_BY_BUILD_APP = {
  [BUILD_APP_NAMES.STRYKE]: {
    title: 'Trade | Stryke',
    description: 'Trade and LP on ETH, BTC, ARB and other option markets.',
    openGraph: {
      title: 'Trade | Stryke',
      description: 'Trade and LP on ETH, BTC, ARB and other option markets.',
      ...OPEN_GRAPH_BASE_DATA,
    },
  },
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: {
    title: 'Trade | Stryke',
    description: 'Trade and LP on ETH, BTC, ARB and other option markets.',
    openGraph: {
      title: 'Trade | Stryke',
      description: 'Trade and LP on ETH, BTC, ARB and other option markets.',
      ...OPEN_GRAPH_BASE_DATA,
    },
  },
  [BUILD_APP_NAMES.KODIAK]: {
    title: 'Trade | Boptions',
    description: 'Trade and LP on bArtio option markets.',
    openGraph: {
      title: 'Trade | Boptions',
      description: 'Trade and LP on bArtio option markets.',
      ...OPEN_GRAPH_BASE_DATA,
    },
  },
  [BUILD_APP_NAMES.PANCAKESWAP]: {
    title: 'Trade | Pancakeswap',
    description: 'Trade and LP on ETH, BTC & ARB Pancakeswap markets.',
    openGraph: {
      title: 'Trade | Pancakeswap',
      description: 'Trade and LP on ETH, BTC & ARB Pancakeswap markets.',
      ...OPEN_GRAPH_BASE_DATA,
    },
  },
};

export const metadata: Metadata = METADATA_BY_BUILD_APP[BUILD_APP_NAME];

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
