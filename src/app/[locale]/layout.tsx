import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import PageWrapper from './components/page-wrapper';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

import Providers from './providers';

import '@/styles/globals.css';

import { InitialTheme } from '@/styles/themes';

export const metadata: Metadata = {
  title: 'Stryke / Maximum reward Minimal risk',
  description: 'Trade BTC, ETH, ARB and other crypto options on the leading decentralized derivative exchange.',
  openGraph: {
    title: 'Stryke / Maximum reward Minimal risk',
    description: 'Trade BTC, ETH, ARB and other crypto options on the leading decentralized derivative exchange.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <main>
      <Providers locale={locale}>
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-background bg-opacity-80 backdrop-blur-sm md:hidden">
          <div className="rounded-lg bg-foreground p-6 text-center text-background shadow-lg">
            <strong className="font-bold">Heads up!</strong>
            <p>This app is only usable on desktop screens for now.</p>
          </div>
        </div>
        <PageWrapper>{children}</PageWrapper>
        <Toaster />
      </Providers>
    </main>
  );
}
