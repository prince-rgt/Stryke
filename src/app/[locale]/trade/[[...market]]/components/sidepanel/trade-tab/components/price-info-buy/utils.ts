import { getSqrtRatioAtTick } from '@/utils/math/tickMath';

type CacheKey = string;
type CacheValue = {
  liquidity: bigint;
  minAmountForNonZeroLiquidity: bigint;
};

const cache: Map<CacheKey, CacheValue> = new Map();

function generateCacheKey(tickLower: number, tickUpper: number, getAmountFnName: string): CacheKey {
  return `${tickLower}-${tickUpper}-${getAmountFnName}`;
}

function findMinAmountForNonZeroLiquidity(
  tickLower: number,
  tickUpper: number,
  getAmountFn: (sqrtRatioAX96: bigint, sqrtRatioBX96: bigint, liquidity: bigint) => bigint,
) {
  const getAmountFnName = getAmountFn.name;
  const cacheKey = generateCacheKey(tickLower, tickUpper, getAmountFnName);

  if (cache.has(cacheKey)) {
    // console.log('cache hit', cacheKey);
    return cache.get(cacheKey) as CacheValue;
  }

  const sqrtRatioAX96 = getSqrtRatioAtTick(BigInt(tickLower));
  const sqrtRatioBX96 = getSqrtRatioAtTick(BigInt(tickUpper));

  let liquidity = BigInt(1);
  let minAmountForNonZeroLiquidity = getAmountFn(sqrtRatioAX96, sqrtRatioBX96, liquidity);

  while (minAmountForNonZeroLiquidity < BigInt(2)) {
    liquidity += BigInt(1000);
    minAmountForNonZeroLiquidity = getAmountFn(sqrtRatioAX96, sqrtRatioBX96, liquidity);
  }

  const result = {
    liquidity,
    minAmountForNonZeroLiquidity,
  };

  cache.set(cacheKey, result);
  return result;
}

export { findMinAmountForNonZeroLiquidity };
