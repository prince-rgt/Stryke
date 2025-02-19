import { SupportedChainIdType, TokenData } from '@/types';
import { Strikes } from '@/types/varrock';

import { Address, checksumAddress, parseUnits, zeroAddress } from 'viem';

import { HOOKS_BY_CHAIN_ID, INCENTIVIZED_POOLS, SupportedTTLs } from '@/consts/clamm';

function aggregateDataAndSetStrikes(
  strikesData: Strikes,
  markPrice: number,
  markPriceUsd: number,
  pair: [TokenData, TokenData],
  circulatingSupply: number,
  quoteAssetPriceUsd: number,
  isMemePair: boolean,
  chainId: number,
  primePool: Address,
) {
  const weeklyHookAddresses = HOOKS_BY_CHAIN_ID[chainId as keyof typeof HOOKS_BY_CHAIN_ID][SupportedTTLs.WEEKLY];

  const rewards = INCENTIVIZED_POOLS[chainId as SupportedChainIdType]?.[checksumAddress(primePool)];

  return strikesData.flatMap((strikeRecord) => {
    return Object.entries(strikeRecord).map(([strikePrice, handlers]) => {
      let totalLiquidity = 0;
      let availableLiquidity = 0;
      let availableLiquidityWeekly = 0;
      let availableTokenLiquidityWeeklyBigInt = BigInt(0);
      let availableTokenLiquidityBigInt = BigInt(0);
      let aprSum = 0;

      const hooks: string[] = [];

      handlers.forEach((handler) => {
        if (weeklyHookAddresses.map((hook) => hook.toLowerCase()).includes(handler.meta.hook.toLowerCase())) {
          hooks.push(handler.meta.hook);
          availableLiquidityWeekly += parseFloat(handler.availableLiquidity);
          availableTokenLiquidityWeeklyBigInt += BigInt(handler.meta.availableTokenLiquidity);
        }

        totalLiquidity += parseFloat(handler.totalLiquidity);
        availableLiquidity += parseFloat(handler.availableLiquidity);
        aprSum += parseFloat(handler.apr);
        availableTokenLiquidityBigInt += BigInt(handler.meta.availableTokenLiquidity);
      });

      const isPut = markPrice > Number(strikePrice);
      const averageApr = handlers.length > 0 ? aprSum / handlers.length : 0;

      const handlersLiquidityData = handlers.map(
        ({
          totalLiquidity,
          meta: { availableLiquidity, availableTokenLiquidity, tickLower, tickUpper, hook },
          handler: { name, handler, pool } = {
            name: 'N/A',
            handler: 'N/A',
            pool: 'N/A',
          },
        }) => {
          return {
            totalLiquidity: parseUnits(totalLiquidity, 0),
            availableLiquidity: parseUnits(availableLiquidity, 0),
            availableTokenLiquidity: parseUnits(availableTokenLiquidity, 0),
            tickLower,
            tickUpper,
            name,
            handler: handler as Address,
            pool: pool as Address,
            hook,
          };
        },
      );

      const handlersLiquidityDataWeekly =
        handlersLiquidityData.filter((handler) => {
          return weeklyHookAddresses.map((hook) => hook.toLowerCase()).includes(handler.hook.toLowerCase());
        }) || [];

      let incentivized: boolean = false;
      if (rewards)
        incentivized =
          (1 + rewards.rewardRange) * markPrice > Number(strikePrice) &&
          (1 - rewards.rewardRange) * markPrice < Number(strikePrice);

      return {
        strikePrice: Number(strikePrice),
        strikePriceUsd: quoteAssetPriceUsd * Number(strikePrice),
        isMemePair,
        circulatingSupply,
        availableLiquidity: {
          amountTokenBigInt: availableTokenLiquidityBigInt,
          amountToken: availableLiquidity,
          amountUSD: (isPut ? availableLiquidity : availableLiquidity * markPrice) * quoteAssetPriceUsd,
        },
        availableLiquidityWeekly: {
          amountTokenBigInt: availableTokenLiquidityWeeklyBigInt,
          amountToken: availableLiquidityWeekly,
          amountUSD: (isPut ? availableLiquidityWeekly : availableLiquidityWeekly * markPrice) * quoteAssetPriceUsd,
        },
        totalLiquidity: {
          amountToken: isPut ? totalLiquidity / Number(strikePrice) : totalLiquidity,
          amountUSD: (isPut ? totalLiquidity : totalLiquidity * markPrice) * quoteAssetPriceUsd,
        },
        utilization: totalLiquidity > 0 ? (1 - availableLiquidity / totalLiquidity) * 100 : 0,
        feeApr: averageApr,
        token: handlers[0].token,
        tickLower: handlers[0].meta.tickLower,
        tickUpper: handlers[0].meta.tickUpper,
        hook: handlers[0].meta.hook,
        callToken: pair[0],
        putToken: pair[1],
        handlersLiquidityData,
        handlersLiquidityDataWeekly,
        primePool,
        chainId,
        incentivized,
      };
      // as StrikeDisplay;
    });
  });
}

export { aggregateDataAndSetStrikes };
