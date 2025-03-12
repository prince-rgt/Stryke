import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { readContracts } from '@wagmi/core';
import { formatUnits } from 'viem';

import StrykeVaultAbi from '@/abi/StrykeVaultAbi';

export interface EpochData {
  startTime: Date | null;
  endTime: Date | null;
  isSettled: boolean;
  isActive: boolean;
  initialVaultAssets: bigint;
  initialYearnDeposits: bigint;
  initialUnutilizedAsset: bigint;
  currentYearnDeposits: bigint;
  currentUnutilizedAsset: bigint;
  fundsBorrowed: bigint;
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
      initialVaultAssets: BigInt(0),
      initialYearnDeposits: BigInt(0),
      initialUnutilizedAsset: BigInt(0),
      currentYearnDeposits: BigInt(0),
      currentUnutilizedAsset: BigInt(0),
      fundsBorrowed: BigInt(0),
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
        initialVaultAssets: BigInt(formatUnits(data.initialVaultAssets, decimals)),
        initialYearnDeposits: BigInt(formatUnits(data.initialYearnDeposits, decimals)),
        initialUnutilizedAsset: BigInt(formatUnits(data.initialUnutilizedAsset, decimals)),
        currentYearnDeposits: BigInt(formatUnits(data.currentYearnDeposits, decimals)),
        currentUnutilizedAsset: BigInt(formatUnits(data.currentUnutilizedAsset, decimals)),
        fundsBorrowed: BigInt(formatUnits(data.fundsBorrowed, decimals)),
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
