import { Address } from 'viem';

import { GaugeData } from './types';

const SUPPORTED_GAUGE_CHAINS = [42161] as const;

const GAUGE_CONTROLLER_ADDR_BY_CHAIN: Record<number, Address> = {
  42161: '0xFdf1B2c4E291b17f8E998e89cF28985fAF3cE6A1',
};

const GAUGES_BY_CHAIN: Record<number, GaugeData[]> = {
  42161: [
    {
      name: 'WETH - USDC - PCS',
      logoURI: ['/images/tokens/weth.svg', '/images/tokens/usdc.svg'],
      address: '0xc16f3f88Bd88CD28fb95df9628866149b1561528',
      chainId: 42161,
    },
    {
      name: 'WBTC - USDC - PCS',
      logoURI: ['/images/tokens/wbtc.svg', '/images/tokens/usdc.svg'],
      address: '0x51d4D761346B8ce4667896825dce39e8c9849D06',
      chainId: 42161,
    },
    {
      name: 'WETH - USDC - ORANGE',
      logoURI: ['/images/tokens/weth.svg', '/images/tokens/usdc.svg'],
      address: '0x4927a62feFE180f9E6307Ef5cb34f94FcAd09227',
      chainId: 42161,
    },
    {
      name: 'WBTC - USDC - ORANGE',
      logoURI: ['/images/tokens/wbtc.svg', '/images/tokens/usdc.svg'],
      address: '0x97b1f6a13500de55B62b57B2D9e30Ca9E9bAB11B',
      chainId: 42161,
    },
    {
      name: 'ARB - USDC - ORANGE',
      logoURI: ['/images/tokens/arb.svg', '/images/tokens/usdc.svg'],
      address: '0x61e9B42f28cdF30173c591b2eB38023ed969d437',
      chainId: 42161,
    },
  ],
};

export { SUPPORTED_GAUGE_CHAINS, GAUGE_CONTROLLER_ADDR_BY_CHAIN, GAUGES_BY_CHAIN };
