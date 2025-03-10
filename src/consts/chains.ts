import { BUILD_APP_NAMES } from '@/types';

import { Address } from 'viem';
import { chainConfig } from 'viem/op-stack';
import {
  berachainTestnetbArtio as _berachainTestnetbArtio,
  mantle as _mantle,
  sonic as _sonic,
  arbitrum,
  arbitrumSepolia,
  base,
  blast,
} from 'wagmi/chains';

import { BUILD_APP_NAME, DRPC_API_KEY } from './env';

const MANTLE_SOURCE_ID = 1;

const mantle = {
  ..._mantle,
  chainConfig,
  contracts: {
    ..._mantle.contracts,
    ...chainConfig.contracts,
    l2OutputOracle: {
      [MANTLE_SOURCE_ID]: {
        address: '0xD1230865641561653406906Fb08873F011c19080' as Address,
      },
    },
    portal: {
      [MANTLE_SOURCE_ID]: {
        address: '0xc54cb22944F2bE476E02dECfCD7e3E7d3e15A8Fb' as Address,
        blockCreated: 19434938,
      },
    },
    l1StandardBridge: {
      [MANTLE_SOURCE_ID]: {
        address: '0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012' as Address,
        blockCreated: 17577718,
      },
    },
  },
  sourceId: MANTLE_SOURCE_ID,
  iconUrl: '/images/tokens/wmnt.svg',
};

const sonic = { ..._sonic, iconUrl: '/images/tokens/s.svg' };

const berachainTestnetbArtio = { ..._berachainTestnetbArtio, iconUrl: '/images/tokens/bera.png' };

const APP_TO_SUPPORTED_CHAINS = {
  // note: order is imp here! the first one will be used as the default chain
  [BUILD_APP_NAMES.KODIAK]: [berachainTestnetbArtio] as const,
  [BUILD_APP_NAMES.PANCAKESWAP]: [arbitrum] as const,
  [BUILD_APP_NAMES.STRYKE]: [arbitrum, sonic, base, blast, mantle, arbitrumSepolia] as const,
  [BUILD_APP_NAMES.BERACHAIN_TESTNET]: [berachainTestnetbArtio] as const,
};

export const SUPPORTED_CHAINS = APP_TO_SUPPORTED_CHAINS[BUILD_APP_NAME];

export const DEFAULT_CHAIN_ID = SUPPORTED_CHAINS[0].id;
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id);

// TODO: remove unused keys
export const CHAINS: {
  [key: number]: {
    name: string;
    rpc: string;
    publicRpc: string;
    explorer: string;
    nativeToken: string;
    icon: string;
    tokenDecimals: { [key: string]: number };
    displayTokens: string[];
  };
} = {
  [arbitrum.id]: {
    name: 'arbitrum',
    rpc: `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://arbitrum-mainnet.infura.io/v3',
    explorer: 'https://arbiscan.io/',
    nativeToken: 'ETH',
    icon: '/images/networks/arbitrum.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
      ARB: 18,
    },
    displayTokens: ['ETH', 'CAKE'],
  },
  [mantle.id]: {
    name: 'Mantle',
    rpc: `https://lb.drpc.org/ogrpc?network=mantle&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://1rpc.io/mantle',
    explorer: 'https://mantlescan.xyz/',
    nativeToken: 'ETH',
    icon: '/images/networks/mantle.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
      ARB: 18,
      WMNT: 18,
    },
    displayTokens: ['ETH', 'USDC', 'WMNT', 'USDT'],
  },
  [base.id]: {
    name: 'Base',
    rpc: `https://lb.drpc.org/ogrpc?network=base&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://mainnet.base.org/',
    explorer: 'https://basescan.org/',
    nativeToken: 'ETH',
    icon: '/images/networks/base.svg',
    tokenDecimals: {
      USDT: 6,
      USDC: 6,
      WETH: 18,
      ARB: 18,
      WMNT: 18,
    },
    displayTokens: ['ETH', 'USDC'],
  },
  [blast.id]: {
    name: 'Blast',
    rpc: `https://lb.drpc.org/ogrpc?network=blast&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://rpc.blast.io/',
    explorer: 'https://blastscan.io/',
    nativeToken: 'ETH',
    icon: '/images/networks/ethereum.svg',
    tokenDecimals: {
      USDB: 18,
      WETH: 18,
      BLAST: 18,
    },
    displayTokens: ['ETH', 'USDC'],
  },
  [berachainTestnetbArtio.id]: {
    name: 'Berachain',
    rpc: `https://lb.drpc.org/ogrpc?network=bartio&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://bartio.rpc.berachain.com/',
    explorer: 'https://bartio.beratrail.io/',
    nativeToken: 'BERA',
    icon: '/images/networks/ethereum.svg',
    tokenDecimals: {
      BERA: 18,
      WBERA: 18,
      USDC: 6,
      HONEY: 18,
    },
    displayTokens: ['BERA', 'USDC', 'WBERA'],
  },
  [sonic.id]: {
    name: 'Sonic',
    rpc: `https://lb.drpc.org/ogrpc?network=sonic&dkey=${DRPC_API_KEY}`,
    publicRpc: 'https://rpc.soniclabs.com',
    explorer: 'https://sonicscan.org',
    nativeToken: 'S',
    icon: '/images/tokens/s.svg',
    tokenDecimals: {
      S: 18,
    },
    displayTokens: ['S'],
  },
};

export const CHAIN_PUBLIC_RPCS = Object.keys(CHAINS).reduce((acc, chainId) => {
  return {
    ...acc,
    [chainId]: CHAINS[Number(chainId)]?.publicRpc,
  };
}, {});
