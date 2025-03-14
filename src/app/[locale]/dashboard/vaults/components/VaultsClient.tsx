'use client';

import Image from 'next/image';

import { formatAddress } from '@/utils/helpers';

import { Typography } from '@/components/ui/typography';
import BackButton from '../components/BackButton';
import Slider from '../components/EpochSlider';
import Panel from '../components/Panel';
import Performance from '../components/Performance';
import Positions from '../components/Positions';
import SideNav from '../components/sidenav';
import Timeline from '../components/Timeline';

import { Arbitrum, BTC, ETH } from '../../../../../assets/images';
import useVaultStore from '../../store/VaultStore';

const VaultsClient: React.FC = () => {
  const { selectedVaultId, vaultDetails, vaultAddress } = useVaultStore();

  const getVaultIcon = () => {
    if (!selectedVaultId) return BTC;

    if (selectedVaultId.includes('BTC')) {
      return BTC;
    } else if (selectedVaultId.includes('ETH')) {
      return ETH;
    }

    return BTC;
  };

  const getAssetSymbol = () => {
    if (!selectedVaultId) return 'WBTC';

    if (selectedVaultId.includes('BTC')) {
      return 'WBTC';
    } else if (selectedVaultId.includes('ETH')) {
      return 'WETH';
    }

    return 'WBTC';
  };

  const getVaultType = () => {
    if (!selectedVaultId) return 'HYBRID';

    if (selectedVaultId.includes('Superbull')) {
      return 'SUPERBULL';
    }

    return 'HYBRID';
  };

  const getContractDuration = () => {
    if (!selectedVaultId) return 'MONTHLY';

    if (selectedVaultId.includes('Monthly')) {
      return 'MONTHLY';
    } else if (selectedVaultId.includes('Quarterly')) {
      return 'QUARTERLY';
    } else if (selectedVaultId.includes('Weekly')) {
      return 'WEEKLY';
    }

    return 'MONTHLY';
  };

  return (
    <div className="flex w-full !pb-20 overflow-y-auto">
      <div className="w-full flex flex-col p-md">
        {/* Header */}
        <div className="w-full flex flex-col gap-md mb-2">
          <div className="flex gap-2 !items-center my-2">
            <BackButton />
            <Image src={getVaultIcon()} alt={selectedVaultId || 'Vault'} className="w-8 h-8 mt-2" />
            <Typography as="h1" variant="h4-bold" className="mt-1">
              {selectedVaultId || 'Vault'}
            </Typography>
          </div>
          <Typography as="p" variant="p-medium" className="text-muted-foreground">
            The {selectedVaultId || 'Vault'} combines Yearn yields with DWF Labs&apos; CEX trading in{' '}
            {getContractDuration().toLowerCase()} epochs. {getAssetSymbol()} deposits earn Yearn APY when idle, while
            DWF can borrow funds for market making, returning profits at epoch end.
          </Typography>
        </div>

        {/* Epoch */}
        <Slider />

        {/* panes */}
        <div className="grid grid-cols-2 divide-x divide-background border border-background bg-secondary my-2">
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel label="TYPE" prop={<small className="font-mono underline">{getVaultType()}</small>} />
            <Panel label="CONTRACT" prop={<small className="font-mono">{getContractDuration()}</small>} />
          </div>
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel
              label="DURATION"
              value={
                <div className="flex gap-2 !items-center">
                  <span>{vaultAddress ? formatAddress(vaultAddress) : '0x000...000'}</span>
                  <Image src={Arbitrum} alt="Arbitrum" />
                </div>
              }
            />
            <Panel
              label="TVL"
              value={
                <div className="flex gap-2">
                  <span>{parseFloat(vaultDetails?.totalAssets as string).toFixed(2) || '0.00'}</span>
                  <span className="text-muted-foreground">{getAssetSymbol()}</span>
                </div>
              }
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="my-4">
          <h1 className="font-semibold text-sm">Timeline</h1>
          <Timeline />
        </div>

        {/* Performance */}
        <div className="">
          <h1 className="font-semibold text-sm">Performance</h1>
          <Performance />
        </div>

        {/* Positions */}
        <div className="my-4">
          <h1 className="font-semibold text-sm">Your Positions</h1>
          <Positions />
        </div>
      </div>

      <div className="h-full w-1/3 ">
        <SideNav />
      </div>
    </div>
  );
};

export default VaultsClient;
