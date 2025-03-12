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
  const [borrowedAmount, setBorrowedAmount] = useState('0');
  const [borrowedSymbol, setBorrowedSymbol] = useState('WBTC');
  const [utilizationRate, setUtilizationRate] = useState(0);
  const [yearnYield, setYearnYield] = useState(0);
  const [mmPnl, setMmPnl] = useState(0);

  const { getSelectedVaultDetails, getSelectedVaultAddress, loading } = useVaultStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaultDetails = await getSelectedVaultDetails();
        const vaultAddress = getSelectedVaultAddress();

        if (!vaultDetails || !vaultAddress) {
          console.error('No vault selected or vault details not available');
          return;
        }

        const amountBorrowed = vaultDetails.currentEpochData.fundsBorrowed;
        setBorrowedAmount(formatUnits(amountBorrowed as bigint, vaultDetails.decimals));
        setBorrowedSymbol(vaultDetails.assetSymbol || 'WBTC');

        const totalAssets = vaultDetails.totalAssets;
        const marginUsagePercentage =
          BigInt(totalAssets) > 0 ? (Number(amountBorrowed) / Number(totalAssets)) * 100 : 0;
        setMarginUsage(marginUsagePercentage);

        const maxBorrow = vaultDetails.maxBorrow || 1;
        const utilizationPercentage = (Number(amountBorrowed) / Number(maxBorrow)) * 100;
        setUtilizationRate(Math.round(utilizationPercentage));

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
          vaultDetails.currentEpochData.initialYearnDeposits > 0
            ? (Number(vaultDetails.currentEpochData.tradingPnl) /
                Number(vaultDetails.currentEpochData.initialYearnDeposits)) *
              100
            : 0;
        setMmPnl(mmPnlPercentage);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [getSelectedVaultDetails, getSelectedVaultAddress, loading]);

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
              <span>{borrowedAmount}</span>
              <span>{borrowedSymbol}</span>
            </div>
          }
        />
        <Panel label="UTILIZATION RATE" value={<span>{utilizationRate} %</span>} />
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
