import { NextIntlClientProvider, useMessages } from 'next-intl';

import { TooltipProvider } from '@/components/ui/tooltip';

import { ThemeProvider } from './Theme';
import WalletQueryClientProvider from './WalletQueryClient';

const Providers = ({ children, locale }: { children: React.ReactNode; locale: string }) => {
  const messages = useMessages();

  return (
    <WalletQueryClientProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </WalletQueryClientProvider>
  );
};

export default Providers;
