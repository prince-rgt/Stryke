import { useMemo } from 'react';
import { getAddress, hexToBigInt, zeroAddress } from 'viem';
import { useReadContract } from 'wagmi';

import generateStrikes from '@/utils/math/generateStrikes';

import useStrikesStore from '../../../../hooks/store/useStrikesStore';

import { HANDLER_TO_POOLS, POOL_TO_ABI } from '@/consts/clamm';

import { useLpStore } from './store/useLpStore';

const useGeneratedStrikes = ({ range = 100 }: { range?: number }) => {
  const { selectedMarket, tick: _tick } = useStrikesStore();
  const { chainId, primePool, pairLabel, pair } = selectedMarket;
  const { selectedAMM } = useLpStore();

  const handlerPoolAddress = HANDLER_TO_POOLS[chainId]?.[selectedAMM]?.[pairLabel];

  const callToken = pair?.[0];
  const putToken = pair?.[1];

  const ammAbi = POOL_TO_ABI[chainId][getAddress(primePool)];

  const { data: poolTickSpacing } = useReadContract({
    abi: ammAbi,
    address: handlerPoolAddress || zeroAddress,
    functionName: 'tickSpacing',
  });

  const { data: slot0 } = useReadContract({
    abi: ammAbi,
    address: handlerPoolAddress || zeroAddress,
    functionName: 'slot0',
  });

  // use current tick from pool contract
  const tick = slot0 ? Number(slot0[1]) : _tick;

  const tickSpacing = poolTickSpacing ? Number(poolTickSpacing) : 10;

  const generatedStrikes = useMemo(() => {
    if (
      !callToken ||
      !putToken
      // || !poolTickSpacing
    )
      return [];

    const token0IsCallToken = hexToBigInt(callToken.address) < hexToBigInt(putToken.address);
    const token0Precision = 10 ** (token0IsCallToken ? callToken.decimals : putToken.decimals);
    const token1Precision = 10 ** (token0IsCallToken ? putToken.decimals : callToken.decimals);

    return generateStrikes(
      tick,
      token0Precision,
      token1Precision,
      !token0IsCallToken,
      //range
      range,
      // ticksapcing
      tickSpacing,
      // strikesSpacingMultiplier
      0,
      // baseTickSpacing
      tickSpacing,
    ).reverse();
  }, [callToken, putToken, range, tick, tickSpacing]);

  return { generatedStrikes };
};

export default useGeneratedStrikes;
