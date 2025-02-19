'use client';

import { SupportedXsykChain } from '@/app/[locale]/xsyk/types';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';

import { getSykConfig } from '@/app/[locale]/xsyk/utils';

import { formatForDisplay } from '@/components/ui/number-display';
import Panel from '@/app/[locale]/xsyk/components/body/summary/panel';

import useXSykStaking from '@/app/[locale]/xsyk/staking/hooks/useXSykStaking';

import { SUPPORTED_XSYK_CHAINS } from '../../../consts';

const Summary = () => {
  const { apr, xSykRewardPercentage, stakedBalance } = useXSykStaking();

  const { xsyk } = getSykConfig(SUPPORTED_XSYK_CHAINS[0]);

  return (
    <div className="grid grid-flow-row grid-cols-3">
      <Panel
        label="Staked"
        value={`${formatForDisplay({
          format: 'tokenAmount',
          value: Number(formatUnits(stakedBalance, xsyk.decimals)),
        })} xSYK`}
      />
      {/* <Panel
        label="Unstake Fee"
        value={formatForDisplay({
          format: 'tokenAmount',
          value: Number(formatUnits(BigInt(0), 18)),
        })}
      /> */}
      <Panel
        label="APR"
        value={`${formatForDisplay({
          format: 'percent',
          value: apr,
          precision: 2,
        })}`}
      />
      <Panel
        label="xSYK/SYK Reward %"
        value={`${formatForDisplay({
          format: 'percent',
          value: Number(xSykRewardPercentage),
          precision: 2,
        })}`}
      />
    </div>
  );
};

export default Summary;
