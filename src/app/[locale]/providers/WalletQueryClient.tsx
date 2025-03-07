'use client';

import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  bybitWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import spindl from '@spindl-xyz/attribution';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createClient } from 'viem';
import { publicActionsL2 } from 'viem/op-stack';
import { Config, createConfig, http, WagmiProvider } from 'wagmi';

import { Typography } from '@/components/ui/typography';

import { CHAINS, SUPPORTED_CHAINS } from '@/consts/chains';
import { ACTIVATE_SPINDL, DRPC_API_KEY, NODE_ENV, SPINDL_SDK_KEY, WALLET_CONNECT_PROJECT_ID } from '@/consts/env';

import '@rainbow-me/rainbowkit/styles.css';

if (typeof window !== 'undefined' && ACTIVATE_SPINDL) {
  spindl.configure({
    sdkKey: SPINDL_SDK_KEY as string,
    debugMode: NODE_ENV === 'development',
  });

  spindl.enableAutoPageViews();
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, walletConnectWallet, rabbyWallet, coinbaseWallet, injectedWallet],
    },
    {
      groupName: 'More',
      wallets: [bybitWallet, okxWallet, rainbowWallet],
    },
  ],
  {
    appName: 'swordfish ii || stryke - options',
    projectId: WALLET_CONNECT_PROJECT_ID!,
  },
);

export const config: Config = createConfig({
  chains: SUPPORTED_CHAINS,
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(CHAINS[chain.id].rpc),
    }).extend(publicActionsL2());
  },
  connectors,
});

const queryClient = new QueryClient();

const WalletQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            disclaimer: () => (
              <Typography variant="small-regular">
                By connecting to Stryke, you agree to our Privacy Policy and Terms of Service.
              </Typography>
            ),
          }}
          theme={darkTheme()}
          modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletQueryClientProvider;
