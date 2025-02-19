import { UserVotesResponseDto } from '@stryke-xyz/shared-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, isAddress, parseEther } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { getUserVotes } from '@/utils/actions/varrock/gauges';
import { generateAccountId, generateGaugeId, getGaugeControllerConfig } from '../utils';
import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import useXSykStaking from '../../xsyk/staking/hooks/useXSykStaking';

import GaugeController from '@/abi/GaugeController';
import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { GAUGES_SUBGRAPH_URL } from '@/consts/env';
import { SUPPORTED_XSYK_CHAINS } from '../../xsyk/consts';
import { GAUGES_BY_CHAIN } from '../consts';

import { SupportedXsykChain } from '../../xsyk/types';
import { RowData, SupportedGaugeControllerChain } from '../types';
import useGaugeControllerStore from './store/useGaugeControllerStore';

const useGaugeController = () => {
  const { chainId: connectedChainId = DEFAULT_CHAIN_ID, address: user } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [chainEpochs, setChainEpochs] = useState<Record<number, bigint>>({});
  const [userVotesData, setUserVotesData] = useState<UserVotesResponseDto | null>(null);

  const { stakedBalance } = useXSykStaking();

  // account id
  const accountId = useMemo(() => {
    if (!user || !isAddress(user)) return null;
    return generateAccountId(connectedChainId as SupportedGaugeControllerChain, user);
  }, [user, connectedChainId]);

  const fetchUserVotes = useCallback(async () => {
    if (accountId) {
      try {
        const data = await getUserVotes(accountId, connectedChainId);
        setUserVotesData(data);
      } catch (error) {
        console.error('Error fetching user votes:', error);
      }
    }
  }, [accountId, connectedChainId]);

  useEffect(() => {
    fetchUserVotes();
  }, [fetchUserVotes]);

  const { xsyk } = useMemo(
    () =>
      getSykConfig(
        connectedChainId in SUPPORTED_XSYK_CHAINS
          ? (connectedChainId as SupportedXsykChain)
          : (42161 as SupportedXsykChain),
      ),
    [connectedChainId],
  );

  const gaugeControllersByChain = useMemo(() => {
    return Object.keys(GAUGES_BY_CHAIN).reduce(
      (acc, chainId) => {
        const { gaugeController } = getGaugeControllerConfig(Number(chainId) as SupportedGaugeControllerChain);
        acc[Number(chainId)] = gaugeController;
        return acc;
      },
      {} as Record<number, Address>,
    );
  }, []);

  const {
    epoch,
    gaugesArray,
    selectedRow,
    voteAmount,
    setEpoch,
    setGaugesArray,
    updateSelectedRow,
    setVoteAmount,
    setVoteTransaction,
    voteTransaction,
    setTotalXsyk,
    setXsykBalance,
    setAccountPowerUsedPerEpoch,
    setTotalPowerUsedPerEpoch,
  } = useGaugeControllerStore();

  const processedGaugesArray: RowData[] = useMemo(() => {
    if (!userVotesData || !gaugesArray) return gaugesArray ? gaugesArray : [];

    return gaugesArray.map((gauge): RowData => {
      const gaugeId = generateGaugeId(gauge.chain as SupportedGaugeControllerChain, gauge.address);
      let userVote = BigInt(0);

      userVotesData.votes.forEach((vote) => {
        if (vote.voteParams_gaugeId === gaugeId && BigInt(vote.voteParams_epoch) === epoch.epoch) {
          userVote += BigInt(vote.voteParams_power);
        }
      });

      const userWeight =
        userVote > BigInt(0) ? (gauge.userWeight ? gauge.userWeight + BigInt(userVote) : BigInt(userVote)) : BigInt(0);

      const share =
        userVote > BigInt(0)
          ? gauge.userWeight
            ? gauge.userWeight + (BigInt(userVote) * BigInt(1e18)) / gauge.weight / BigInt(1e16)
            : (Number(userVote) * 1e18) / Number(gauge.weight) / 1e16
          : BigInt(0);

      return {
        ...gauge,
        userWeight,
        share: Number(share),
      };
    });
  }, [userVotesData, gaugesArray, epoch.epoch]);

  const contracts = useMemo(() => {
    const allContracts: any[] = [];

    Object.entries(gaugeControllersByChain).forEach(([chainId, gaugeController]) => {
      allContracts.push(
        { address: gaugeController, abi: GaugeController, functionName: 'epoch', args: [], chainId: Number(chainId) },
        {
          address: gaugeController,
          abi: GaugeController,
          functionName: 'genesis',
          args: [],
          chainId: Number(chainId),
        },
        {
          address: gaugeController,
          abi: GaugeController,
          functionName: 'EPOCH_LENGTH',
          args: [],
          chainId: Number(chainId),
        },
      );
    });

    // Add user-specific contracts only for the connected chain
    if (isAddress(gaugeControllersByChain[connectedChainId])) {
      allContracts.push({
        address: xsyk.address,
        abi: xStrykeTokenAbi,
        functionName: 'totalSupply',
        args: [],
        chainId: connectedChainId,
      });
      if (user) {
        allContracts.push({
          address: xsyk.address,
          abi: xStrykeTokenAbi,
          functionName: 'balanceOf',
          args: [user],
          chainId: connectedChainId,
        });
      }
    } else {
      allContracts.push({
        address: xsyk.address,
        abi: xStrykeTokenAbi,
        functionName: 'totalSupply',
        args: [],
        chainId: DEFAULT_CHAIN_ID,
      });
    }
    return allContracts;
  }, [gaugeControllersByChain, connectedChainId, user, xsyk]);

  const { data: readsData, isSuccess: isReadsSuccess } = useReadContracts({ contracts });

  useMemo(() => {
    if (isReadsSuccess && readsData) {
      const chainData: Record<number, any> = {};
      const newChainEpochs: Record<number, bigint> = {};

      readsData.forEach((result, index) => {
        if (result.status === 'success') {
          const contract = contracts[index];
          const chainId = contract.chainId;
          if (!chainData[chainId]) {
            chainData[chainId] = {};
          }
          chainData[chainId][contract.functionName] = result.result;

          if (contract.functionName === 'epoch') {
            newChainEpochs[chainId] = BigInt(result.result as string | number | bigint);
          }
        }
      });

      setChainEpochs(newChainEpochs);

      Object.entries(chainData).forEach(([chainId, data]) => {
        let newEpoch = BigInt(data.epoch ?? 0);
        const genesis = BigInt(data.genesis ?? 0);
        const EPOCH_LENGTH = BigInt(data.EPOCH_LENGTH ?? 0);
        let epochEnd = genesis + (newEpoch + BigInt(1)) * EPOCH_LENGTH;

        if (newEpoch != BigInt(0) && genesis === BigInt(0)) {
          newEpoch = BigInt(0);
          epochEnd = BigInt(1);
        }

        if (Number(chainId) === connectedChainId || Number(chainId) === 42161) {
          setEpoch({ epoch: newEpoch, epochEnd, epochLength: EPOCH_LENGTH });

          if (typeof data.totalSupply === 'bigint') {
            setTotalXsyk(data.totalSupply);
          }
          if (typeof data.balanceOf === 'bigint') {
            setXsykBalance(data.balanceOf + stakedBalance);
          }
        }
      });
    }
  }, [isReadsSuccess, readsData, contracts, setEpoch, setTotalXsyk, setXsykBalance, connectedChainId, stakedBalance]);

  const accountPowerUsedPerEpoch = useCallback(() => {
    if (!user || !isAddress(user)) return [];

    const accountId = generateAccountId(connectedChainId as SupportedGaugeControllerChain, user);

    return [
      {
        address: gaugeControllersByChain[connectedChainId],
        abi: GaugeController,
        functionName: 'accountPowerUsedPerEpoch',
        args: [epoch.epoch, accountId],
      },
    ];
  }, [epoch.epoch, gaugeControllersByChain, user, connectedChainId]);

  const { data: accountPowerUsedPerEpochData, isSuccess: isReadsSuccessAccount } = useReadContracts({
    contracts: accountPowerUsedPerEpoch(),
  });

  useMemo(() => {
    if (
      accountPowerUsedPerEpochData !== undefined &&
      accountPowerUsedPerEpochData[0]?.result !== undefined &&
      isReadsSuccessAccount
    ) {
      setAccountPowerUsedPerEpoch(BigInt(accountPowerUsedPerEpochData[0].result as string | number | bigint));
    }
  }, [accountPowerUsedPerEpochData, setAccountPowerUsedPerEpoch, isReadsSuccessAccount]);

  // get gauges data
  const gaugeReads = useCallback(() => {
    return Object.entries(GAUGES_BY_CHAIN).flatMap(([chainId, gauges]) => {
      const gaugeController = gaugeControllersByChain[Number(chainId)];
      if (!gaugeController) return [];

      let chainEpoch = chainEpochs[Number(chainId)];
      if (!chainEpoch) chainEpoch = BigInt(0);

      const gaugeCalls = gauges.flatMap((gauge) => {
        const gaugeId = generateGaugeId(Number(chainId) as SupportedGaugeControllerChain, gauge.address);
        return [
          {
            address: gaugeController,
            abi: GaugeController,
            functionName: 'gaugePowersPerEpoch',
            args: [chainEpoch, gaugeId],
            chainId: Number(chainId),
          },
          {
            address: gaugeController,
            abi: GaugeController,
            functionName: 'computeRewards',
            args: [gaugeId, chainEpoch],
            chainId: Number(chainId),
          },
        ];
      });

      gaugeCalls.push({
        address: gaugeController,
        abi: GaugeController,
        functionName: 'totalPowerUsedPerEpoch',
        args: [chainEpoch],
        chainId: Number(chainId),
      });
      return gaugeCalls;
    });
  }, [gaugeControllersByChain, chainEpochs]);

  const { data: gaugeReadsData } = useReadContracts({
    contracts: gaugeReads(),
  });

  useMemo(() => {
    if (!gaugeReadsData) {
      if (Object.keys(gaugeControllersByChain).length === 0) {
        setIsLoading(false);
      }
      return;
    }

    const newGaugesArray: RowData[] = [];
    Object.entries(GAUGES_BY_CHAIN).forEach(([chainId, gauges]) => {
      const chainGaugeData = gaugeReadsData.filter((data, index) => gaugeReads()[index].chainId === Number(chainId));
      gauges.forEach((gauge, index) => {
        const weightData = chainGaugeData[index * 2];
        const rewardsData = chainGaugeData[index * 2 + 1];
        if (weightData?.status === 'success' && rewardsData?.status === 'success') {
          const epochData = readsData?.find(
            (data) =>
              data.status === 'success' &&
              contracts[readsData.indexOf(data)]?.chainId === Number(chainId) &&
              contracts[readsData.indexOf(data)]?.functionName === 'epoch',
          );
          const genesisData = readsData?.find(
            (data) =>
              data.status === 'success' &&
              contracts[readsData.indexOf(data)]?.chainId === Number(chainId) &&
              contracts[readsData.indexOf(data)]?.functionName === 'genesis',
          );
          let epoch = epochData ? BigInt(epochData.result as string | number | bigint) : BigInt(0);
          if (genesisData?.result === BigInt(0)) {
            epoch = BigInt(0);
          }
          newGaugesArray.push({
            name: gauge.name,
            logo: gauge.logoURI,
            weight: BigInt(weightData.result as string | number | bigint),
            rewards: BigInt(rewardsData.result as string | number | bigint),
            chain: Number(chainId),
            epoch: epoch,
            address: gauge.address,
            userWeight: BigInt(0),
            share: 0,
          });
        }
      });
    });

    setGaugesArray(newGaugesArray);
    const totalPowerUsedPerEpochData = gaugeReadsData.find(
      (data, index) =>
        gaugeReads()[index].chainId === connectedChainId &&
        gaugeReads()[index].functionName === 'totalPowerUsedPerEpoch' &&
        data.status === 'success',
    );
    if (totalPowerUsedPerEpochData && totalPowerUsedPerEpochData.status === 'success') {
      setTotalPowerUsedPerEpoch(BigInt(totalPowerUsedPerEpochData.result as string | number | bigint));
    }
    setIsLoading(false);
  }, [
    gaugeReadsData,
    readsData,
    contracts,
    setGaugesArray,
    setTotalPowerUsedPerEpoch,
    connectedChainId,
    gaugeReads,
    gaugeControllersByChain,
  ]);

  useEffect(() => {
    if (!selectedRow || voteAmount == 0n || selectedRow.address == undefined || user == undefined) {
      setVoteTransaction(null);
      return;
    }

    const gaugeId = generateGaugeId(selectedRow.chain as SupportedGaugeControllerChain, selectedRow.address);
    // Check each value individually
    const power = voteAmount;

    const totalPower = selectedRow.weight;

    const epochValue = epoch.epoch;

    const voteArgs = {
      power,
      totalPower,
      epoch: epochValue,
      gaugeId,
      accountId,
    };

    setVoteTransaction([voteArgs]);
  }, [selectedRow, voteAmount, epoch.epoch, user, setVoteTransaction, epoch, accountId]);

  return {
    epoch,
    gaugesArray,
    selectedRow,
    voteAmount,
    gaugeControllersByChain,
    updateSelectedRow,
    setVoteAmount,
    isLoading,
    voteTransaction, // Add this to the return value
    processedGaugesArray,
    gaugeReads,
  };
};

export default useGaugeController;
