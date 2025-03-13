import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { readContracts } from '@wagmi/core';
import { formatUnits } from 'viem';

import StrykeVaultAbi from '@/abi/StrykeVaultAbi';

export interface EpochData {
  startTime: Date | null;
  endTime: Date | null;
  isSettled: boolean;
  isActive: boolean;
  initialVaultAssets: string;
  initialYearnDeposits: string;
  initialUnutilizedAsset: string;
  currentYearnDeposits: string;
  currentUnutilizedAsset: string;
  fundsBorrowed: string;
  finalVaultAssets: string;
  yearnPnl: number;
  tradingPnl: string;
}

export const getEpochData = async (
  vaultAddress: `0x${string}`,
  epochId: bigint,
  decimals: number,
): Promise<EpochData> => {
  try {
    let epochData: EpochData = {
      startTime: null,
      endTime: null,
      isSettled: false,
      isActive: false,
      initialVaultAssets: '0',
      initialYearnDeposits: '0',
      initialUnutilizedAsset: '0',
      currentYearnDeposits: '0',
      currentUnutilizedAsset: '0',
      fundsBorrowed: '0',
      finalVaultAssets: '0',
      yearnPnl: 0,
      tradingPnl: '0',
    };

    if (epochId <= 0) {
      return epochData;
    }

    const epochDataResult = await readContracts(config, {
      contracts: [
        {
          address: vaultAddress,
          abi: StrykeVaultAbi,
          functionName: 'getEpochData',
          args: [epochId],
        },
      ],
    });

    if (epochDataResult[0].result) {
      const data = epochDataResult[0].result as any;

      epochData = {
        startTime: data.startTime ? new Date(Number(data.startTime) * 1000) : null,
        endTime: data.endTime ? new Date(Number(data.endTime) * 1000) : null,
        isSettled: data.isSettled,
        isActive: data.isEpochActive,
        initialVaultAssets: formatUnits(data.initialVaultAssets, decimals),
        initialYearnDeposits: formatUnits(data.initialYearnDeposits, decimals),
        initialUnutilizedAsset: formatUnits(data.initialUnutilizedAsset, decimals),
        currentYearnDeposits: formatUnits(data.currentYearnDeposits, decimals),
        currentUnutilizedAsset: formatUnits(data.currentUnutilizedAsset, decimals),
        fundsBorrowed: formatUnits(data.fundsBorrowed, decimals),
        finalVaultAssets: formatUnits(data.finalVaultAssets, decimals),
        yearnPnl: Number(formatUnits(data.yearnPnl, decimals)),
        tradingPnl: formatUnits(data.tradingPnl, decimals),
      };
    }

    return epochData;
  } catch (error) {
    console.error('Error fetching epoch data:', error);
    throw error;
  }
};

export default getEpochData;
