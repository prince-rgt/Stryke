'use client';

import { useTranslations } from 'next-intl';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';

import { cn } from '@/utils/styles';

import AreaWithRect from '@/components/charts/pnl-history-chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import PnlPanel from './pnl-panel';
import usePnlDelta, { PnlDeltaErrors } from './usePnlDelta';
import WalletNotConnectedPlaceHolder from './wallet-not-connected-place-holder';

const PnlChart = () => {
  const tDashboard = useTranslations('Dashboard');
  const { address } = useAccount();

  const {
    data: pnlDelta,
    isLoading: isPnlDeltaLoading,
    error,
    refetch,
  } = usePnlDelta({
    user: address ? address : zeroAddress,
    interval: '30D',
  });

  return (
    <div className={cn('flex h-full w-full flex-col space-y-md bg-primary', isPnlDeltaLoading && 'blur-sm')}>
      {error ? (
        <WalletNotConnectedPlaceHolder
          message={
            error === PnlDeltaErrors.WALLET_NOT_CONNECTED
              ? tDashboard('PnlDeltaChart.WalletNotConnected.Heading')
              : tDashboard('PnlDeltaChart.FetchFail.Heading')
          }
        />
      ) : pnlDelta.length === 0 ? (
        <WalletNotConnectedPlaceHolder message={tDashboard('PnlDeltaChart.NoData.Heading')} />
      ) : (
        <div className="max-h-[260px] p-md">
          <div className={cn('flex items-center justify-between')}>
            <PnlPanel
              difference={pnlDelta[pnlDelta.length - 1].value / Math.max(pnlDelta[0].value, 1)}
              cumulative={pnlDelta[pnlDelta.length - 1].value}
            />
            <ToggleGroup disabled onValueChange={(v: any) => {}} defaultValue="7D" type="single">
              <ToggleGroupItem value="30D">30D</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <AreaWithRect data={pnlDelta} />
        </div>
      )}
    </div>
  );
};

export default PnlChart;
