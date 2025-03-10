import { Metadata } from 'next';

import VaultsClient from './components/VaultsClient';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

export const metadata: Metadata = {
  title: 'Vaults | Stryke',
  description: 'View all available option markets and your trading performance on Stryke.',
  openGraph: {
    title: 'Vaults | Stryke',
    description: 'View all available option markets and your trading performance on Stryke.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

export default function Vaults() {
  return <VaultsClient />;
}
