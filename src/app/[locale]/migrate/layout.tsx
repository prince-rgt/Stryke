import type { Metadata } from 'next';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

export const metadata: Metadata = {
  title: 'Migrate DPX/rDPX | Stryke',
  description: 'Migrate DPX/rDPX to SYK or xSYK.',
  openGraph: {
    title: 'Migrate DPX/rDPX | Stryke',
    description: 'Migrate DPX/rDPX to SYK or xSYK.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
