import CoinbaseLogo from '@/components/icons/coinbase-logo';

const SUPPORTED_WALLETS = [
  {
    label: 'MetaMask',
    Icon: CoinbaseLogo,
    walletId: 'metamask',
  },

  {
    label: 'Coinbase Wallet',
    Icon: CoinbaseLogo,
    // for rainbow kit
    walletId: 'coinbase',
  },

  {
    label: 'WalletConnect',
    Icon: CoinbaseLogo,
    walletId: 'walletConnect',
  },
  {
    label: 'Rabby',
    Icon: CoinbaseLogo,
    walletId: 'rabby',
  },

  {
    label: 'Injected',
    Icon: CoinbaseLogo,
    walletId: 'injected',
  },
];

export { SUPPORTED_WALLETS };
