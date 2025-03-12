import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { readContracts } from '@wagmi/core';
import { formatUnits } from 'viem';

import StrykeVaultAbi from '@/abi/StrykeVaultAbi';

export const getYearnPnl = async (
  vaultAddress: `0x${string}`,
  yearnVaultAddress: `0x${string}`,
  initialYearnDeposited: bigint,
  currentYearnDeposited: bigint,
  decimals: number,
): Promise<number> => {
  try {
    if (!vaultAddress || !yearnVaultAddress) {
      console.error('Invalid vault or Yearn vault address');
      return 0;
    }

    if (initialYearnDeposited <= BigInt(0)) {
      return 0;
    }

    const yearnResults = await readContracts(config, {
      contracts: [
        {
          address: yearnVaultAddress,
          abi: StrykeVaultAbi,
          functionName: 'balanceOf',
          args: [vaultAddress],
        },
      ],
    });

    const sharesBalance = yearnResults[0].result as bigint;

    if (!sharesBalance || sharesBalance <= BigInt(0)) {
      return 0;
    }

    const assetResults = await readContracts(config, {
      contracts: [
        {
          address: yearnVaultAddress,
          abi: StrykeVaultAbi,
          functionName: 'convertToAssets',
          args: [sharesBalance],
        },
      ],
    });

    const assetValue = assetResults[0].result as bigint;

    const yieldAmount = assetValue - currentYearnDeposited;

    const yieldPercentage =
      initialYearnDeposited > BigInt(0) ? (Number(yieldAmount) * 100) / Number(initialYearnDeposited) : 0;

    return parseFloat(yieldPercentage.toFixed(2));
  } catch (error) {
    console.error('Error calculating Yearn PnL:', error);
    return 0;
  }
};

export default getYearnPnl;
