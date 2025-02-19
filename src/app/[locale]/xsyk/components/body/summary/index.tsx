'use client';

import { SupportedChainIdType } from '@/types';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { useQuery } from '@tanstack/react-query';
import { erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

import { getUserData } from '@/utils/actions/varrock/xsyk';
import { getSykConfig } from '../../../utils';

import { formatForDisplay } from '@/components/ui/number-display';
import Panel from '@/app/[locale]/xsyk/components/body/summary/panel';

import xStrykeTokenAbi from '@/abi/xStrykeTokenAbi';

import { DEFAULT_CHAIN_ID } from '@/consts/chains';
import { SUPPORTED_XSYK_CHAINS } from '../../../consts';

const Summary = () => {
  const { address: user = '0x', chainId = DEFAULT_CHAIN_ID } = useAccount();

  const { syk, xsyk } = getSykConfig(
    chainId in SUPPORTED_XSYK_CHAINS ? (chainId as SupportedXsykChain) : (42161 as SupportedXsykChain),
  );

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: syk.address,
        functionName: 'balanceOf',
        args: [user],
      },
      {
        abi: xStrykeTokenAbi,
        address: xsyk.address,
        functionName: 'balanceOf',
        args: [user],
      },
    ],
  });

  const { data: userXSykData } = useQuery({
    queryKey: [user, chainId],
    queryFn: async () =>
      await getUserData(
        {
          chainId: chainId as SupportedChainIdType,
        },
        user,
      ),
    staleTime: 1000,
  });

  return (
    <div className="grid grid-flow-col grid-rows-1 divide-x divide-background">
      <Panel
        label="Your SYK"
        value={formatForDisplay({
          format: 'tokenAmount',
          value: Number(formatUnits(contractData?.[0].result ?? BigInt(0), syk.decimals)),
        })}
      />
      <Panel
        label="Available xSYK"
        value={formatForDisplay({
          format: 'tokenAmount',
          value: Number(formatUnits(contractData?.[1].result ?? BigInt(0), xsyk.decimals)),
        })}
      />
      <Panel
        label="Allocated XSYK"
        value={formatForDisplay({
          format: 'tokenAmount',
          value: Number(userXSykData?.totalXSykAllocated ?? 0),
        })}
      />
      <Panel
        label="Pending Vesting"
        value={formatForDisplay({
          format: 'tokenAmount',
          value: Number(userXSykData?.totalSykPending ?? 0),
        })}
      />
    </div>
  );
};

export default Summary;
