import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { writeContract } from '@wagmi/core';
import { parseUnits } from 'viem';

import ERC20Abi from '@/abi/ERC20Abi';
import StrykeVaultAbi from '@/abi/StrykeVaultAbi';

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export const approveTokenForVault = async (
  tokenAddress: `0x${string}`,
  vaultAddress: `0x${string}`,
  amount: string,
  decimals: number,
): Promise<any> => {
  try {
    const amountInWei = parseUnits(amount, decimals);

    const tx = await writeContract(config, {
      address: tokenAddress,
      abi: ERC20Abi,
      functionName: 'approve',
      args: [vaultAddress, amountInWei],
    });

    return tx;
  } catch (error) {
    console.error('Error approving token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const depositToVault = async (
  vaultAddress: `0x${string}`,
  amount: string,
  decimals: number,
  receiver: `0x${string}`,
): Promise<any> => {
  try {
    const amountInWei = parseUnits(amount, decimals);

    const tx = await writeContract(config, {
      address: vaultAddress,
      abi: StrykeVaultAbi,
      functionName: 'deposit',
      args: [amountInWei, receiver],
    });
    return tx;
  } catch (error) {
    console.error('Error depositing to vault:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
