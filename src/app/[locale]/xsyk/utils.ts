import { SupportedChainIdType } from '@/types';

import { arbitrum } from 'viem/chains';

import { getTokenData } from '@/utils/tokens';

import { SYK_ADDR, XSYK_ADDR_BY_CHAIN, XSYK_STAKING_BY_CHAIN } from './consts';

/**
 * @dev retrieve config governing syk/xsyk token data and all relevant cross-chain contracts
 * @param chainId the chain id to retrieve config
 * @returns syk, xsyk, xsyk staking addresses specific to selected chain
 */
const getSykConfig = (chainId: SupportedChainIdType = 42161) => {
  const [syk, xsyk, xsykStaking] = [
    getTokenData({ chainId: arbitrum.id, address: SYK_ADDR }),
    getTokenData({ chainId, address: XSYK_ADDR_BY_CHAIN[chainId] }),
    XSYK_STAKING_BY_CHAIN[chainId],
  ];

  return {
    syk,
    xsyk,
    xsykStaking,
  };
};

export { getSykConfig };
