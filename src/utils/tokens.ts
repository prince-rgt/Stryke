import { SupportedChainIdType, TokenData } from '@/types';

import { Address, zeroAddress } from 'viem';

import { TOKEN_LIST_BY_CHAIN_ID } from '@/consts/token-list';

const fallbackTokenData: TokenData = {
  chainId: 42161,
  address: zeroAddress,
  name: 'Unknown Token',
  symbol: 'UNKNOWN',
  logoURI: '',
  decimals: 18,
};

function getTokenData({ address, chainId }: { address: Address; chainId: SupportedChainIdType }): TokenData {
  const tokenList = TOKEN_LIST_BY_CHAIN_ID[chainId];

  if (!tokenList) return fallbackTokenData;

  const tokenData = tokenList.find((token) => token.address.toLowerCase() === address.toLowerCase());

  if (!tokenData) return fallbackTokenData;

  return tokenData;
}

const getTokenLogoURI = (tokenData: TokenData) => {
  return tokenData.logoURI.replace('BASE_URL', '');
};

export { getTokenData, getTokenLogoURI };
