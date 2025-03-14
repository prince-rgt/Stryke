import Image from 'next/image';
import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';

import getYearnPnl from '@/utils/actions/varrock/getYearnPnl';

import { Yearn } from '@/assets/images';

import useVaultStore from '../../store/VaultStore';
import PerformanceChart from './Chart';
import Panel from './Panel';

const Performance = () => {
  const [marginUsage, setMarginUsage] = useState(0);
  const [yearnYield, setYearnYield] = useState(0);
  const [mmPnl, setMmPnl] = useState(0);

  const { loading, vaultDetails, vaultAddress } = useVaultStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!vaultDetails || !vaultAddress) {
          console.error('No vault selected or vault details not available');
          return;
        }
        const isSettled = vaultDetails.currentEpochData.isSettled;
        if (!isSettled) {
          const amountBorrowed = vaultDetails.currentEpochData.fundsBorrowed;
          const maxBorrow = vaultDetails.maxBorrow || 0;
          let numerator = Number(amountBorrowed) * 100;
          let denominator = Number(maxBorrow) + Number(amountBorrowed);
          if (denominator != 0) {
            let result = numerator / denominator;
            setMarginUsage(result);
          }

          let yieldPercentage = 0;
          if (vaultDetails.currentEpochData.yearnPnl && vaultDetails.currentEpochData.yearnPnl > 0) {
            yieldPercentage = vaultDetails.currentEpochData.yearnPnl;
          } else {
            yieldPercentage = await getYearnPnl(
              vaultAddress,
              vaultDetails.yearnVaultAddress as `0x${string}`,
              vaultDetails.currentEpochData.initialYearnDeposits,
              vaultDetails.currentEpochData.currentYearnDeposits,
              vaultDetails.decimals,
            );
          }
          setYearnYield(yieldPercentage);

          const mmPnlPercentage =
            Number(vaultDetails.currentEpochData.initialYearnDeposits) > 0
              ? (Number(vaultDetails.currentEpochData.tradingPnl) /
                  Number(vaultDetails.currentEpochData.initialYearnDeposits)) *
                100
              : 0;
          setMmPnl(mmPnlPercentage);
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [vaultDetails, vaultAddress, loading]);

  return (
    <div className="w-full flex bg-secondary">
      <div className="w-1/2 border-r-2 border-black grid-row-1 grid divide-y divide-background">
        <Panel
          label="MARGIN USAGE"
          prop={
            <div className="flex h-1 w-1/3 items-center rounded-full bg-gray-600">
              <div className="h-1 rounded-full bg-success" style={{ width: `${marginUsage}%` }}></div>
            </div>
          }
        />
        <Panel
          label="BORROWED AMOUNT"
          value={
            <div className="flex gap-2 !items-center">
              <span>{vaultDetails.currentEpochData.fundsBorrowed.toString()}</span>
              <span>{vaultDetails.assetSymbol}</span>
            </div>
          }
        />
        <Panel label="UTILIZATION RATE" value={<span>{marginUsage.toFixed(2)} %</span>} />
        <Panel
          label="YEARN YIELD"
          labelClasses="underline"
          value={
            <div className="flex gap-2 !items-center">
              <span className="text-[#43E6F2] mt-0.5">{`${yearnYield.toFixed(2)}%`}</span>
              <Image src={Yearn} alt="" />
            </div>
          }
        />
        <Panel
          label="MARKET MAKER PNL"
          labelClasses="underline underline:bg-blue-500"
          value={<span className="text-[#EBFF00]">{`${mmPnl.toFixed(2)}%`}</span>}
        />
      </div>

      {/* Chart */}
      <div className="w-1/2 text-xs p-3">
        <div className="border-2 border-black flex justify-center items-center h-full">
          <PerformanceChart />
        </div>
      </div>
    </div>
  );
};

export default Performance;
