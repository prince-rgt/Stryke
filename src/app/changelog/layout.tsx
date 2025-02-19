import { Metadata } from 'next';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Changelog | Stryke',
  description: 'Changelog for the Stryke Platform',
  openGraph: {
    title: 'Changelog | Stryke',
    description: 'Changelog for the Stryke Platform',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
