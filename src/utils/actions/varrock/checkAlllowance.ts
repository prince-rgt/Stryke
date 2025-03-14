import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { readContracts } from '@wagmi/core';
import { formatUnits, parseUnits } from 'viem';

import ERC20Abi from '@/abi/ERC20Abi';

export async function checkAllowance(
  tokenAddress: `0x${string}`,
  vaultAddress: `0x${string}`,
  userAddress: `0x${string}`,
  amount: string,
  decimals: number,
): Promise<boolean> {
  try {
    if (!amount || parseFloat(amount) <= 0) {
      return true;
    }

    const amountBigInt = parseUnits(amount, decimals);
    const result = await readContracts(config, {
      contracts: [
        {
          address: tokenAddress,
          abi: ERC20Abi,
          functionName: 'allowance',
          args: [userAddress, vaultAddress],
        },
      ],
    });

    const allowanceBigInt = (result[0].result as bigint) || BigInt(0);

    return allowanceBigInt >= amountBigInt;
  } catch (error) {
    console.error('Error checking allowance:', error);
    return false;
  }
}

export default checkAllowance;
