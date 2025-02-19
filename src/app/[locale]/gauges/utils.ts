import { Address, encodeAbiParameters, keccak256 } from 'viem';

import { GAUGE_CONTROLLER_ADDR_BY_CHAIN, GAUGES_BY_CHAIN } from './consts';

import { SupportedGaugeControllerChain } from './types';

const getGaugeControllerConfig = (chainId: SupportedGaugeControllerChain = 42161) => {
  const gaugeController = GAUGE_CONTROLLER_ADDR_BY_CHAIN[chainId];
  const gauges = GAUGES_BY_CHAIN[chainId];

  return {
    gaugeController,
    gauges,
  };
};

const generateAccountId = (chainId: SupportedGaugeControllerChain, user: Address) => {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'chainId', type: 'uint256' },
        { name: 'user', type: 'address' },
      ],
      [BigInt(chainId), user],
    ),
  );
};

const generateGaugeId = (chainId: SupportedGaugeControllerChain, gauge: Address) => {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'chainId', type: 'uint256' },
        { name: 'gauge', type: 'address' },
      ],
      [BigInt(chainId), gauge],
    ),
  );
};

export { getGaugeControllerConfig, generateAccountId, generateGaugeId };
