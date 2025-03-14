import { config } from '@/app/[locale]/providers/WalletQueryClient';
import { readContracts } from '@wagmi/core';
import { formatUnits } from 'viem';

import ERC20Abi from '@/abi/ERC20Abi';
import StrykeVaultAbi from '@/abi/StrykeVaultAbi';

import getEpochData, { EpochData } from './getEpochData';

export interface VaultDetails {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;

  userBalance: string;
  userBalanceInAssets: string;
  userAllowance: string;

  asset: string;
  assetName: string;
  assetSymbol: string;
  assetDecimals: number;
  assetUserBalance: string;
  assetUserAllowance: string;
  totalAssets: string;
  depositsPaused: boolean;
  withdrawalsPaused: boolean;

  currentEpoch: bigint;
  epochDuration: string;
  maxBorrow: string;
  yearnVaultAddress: string;

  currentEpochData: EpochData;
}

export const getVaultDetails = async (
  vaultAddress: `0x${string}`,
  userAddress: `0x${string}`,
): Promise<VaultDetails> => {
  try {
    const tokenResults = await readContracts(config, {
      contracts: [
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'name' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'symbol' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'decimals' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'totalSupply' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'balanceOf', args: [userAddress] },
        {
          address: vaultAddress,
          abi: StrykeVaultAbi,
          functionName: 'allowance',
          args: [userAddress, vaultAddress],
        },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'asset' },
      ],
    });

    const userShares = (tokenResults[4].result as bigint) || BigInt(0);

    const vaultResults = await readContracts(config, {
      contracts: [
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'totalAssets' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'depositsPaused' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'withdrawalsPaused' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'currentEpoch' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'epochDuration' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'maxBorrow' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'yearnVault' },
        { address: vaultAddress, abi: StrykeVaultAbi, functionName: 'convertToAssets', args: [userShares] },
      ],
    });

    const assetAddress = tokenResults[6].result as `0x${string}`;

    const assetResults = await readContracts(config, {
      contracts: [
        { address: assetAddress, abi: ERC20Abi, functionName: 'name' },
        { address: assetAddress, abi: ERC20Abi, functionName: 'symbol' },
        { address: assetAddress, abi: ERC20Abi, functionName: 'decimals' },
        { address: assetAddress, abi: ERC20Abi, functionName: 'balanceOf', args: [userAddress] },
        {
          address: assetAddress,
          abi: ERC20Abi,
          functionName: 'allowance',
          args: [userAddress, vaultAddress],
        },
      ],
    });

    const decimals = Number(tokenResults[2].result || 18);
    const assetDecimals = Number(assetResults[2].result || 18);
    const currentEpochId = vaultResults[3].result;

    const currentEpochData = await getEpochData(vaultAddress, currentEpochId as bigint, decimals);

    return {
      name: tokenResults[0].result as string,
      symbol: tokenResults[1].result as string,
      decimals: decimals,
      totalSupply: formatUnits((tokenResults[3].result as bigint) || BigInt(0), decimals),
      userBalance: formatUnits(userShares, decimals),
      userBalanceInAssets: formatUnits((vaultResults[7].result as bigint) || BigInt(0), assetDecimals),
      userAllowance: formatUnits((tokenResults[5].result as bigint) || BigInt(0), decimals),

      asset: assetAddress,
      assetName: assetResults[0].result as string,
      assetSymbol: assetResults[1].result as string,
      assetDecimals: assetDecimals,
      assetUserBalance: formatUnits((assetResults[3].result as bigint) || BigInt(0), assetDecimals),
      assetUserAllowance: formatUnits((assetResults[4].result as bigint) || BigInt(0), assetDecimals),
      totalAssets: formatUnits((vaultResults[0].result as bigint) || BigInt(0), assetDecimals),
      depositsPaused: vaultResults[1].result as boolean,
      withdrawalsPaused: vaultResults[2].result as boolean,

      currentEpoch: currentEpochId as bigint,
      epochDuration: ((vaultResults[4].result as bigint) || BigInt(0)).toString(),
      maxBorrow: formatUnits((vaultResults[5].result as bigint) || BigInt(0), decimals),
      yearnVaultAddress: vaultResults[6].result as string,

      currentEpochData,
    };
  } catch (error) {
    console.error('Error fetching vault details:', error);
    throw error;
  }
};

export default getVaultDetails;
