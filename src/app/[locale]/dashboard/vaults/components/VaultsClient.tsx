'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { formatAddress } from '@/utils/helpers';

import { Typography } from '@/components/ui/typography';
import BackButton from '../components/BackButton';
import Slider from '../components/EpochSlider';
import Panel from '../components/Panel';
import Performance from '../components/Performance';
import Positions from '../components/Positions';
import SideNav from '../components/sidenav';
import Timeline from '../components/Timeline';

import { Arbitrum } from '../../../../../assets/images';
import { VAULT_CONFIGS, VAULT_IDS } from '../../store/vaultConfigs';
import useVaultStore from '../../store/VaultStore';

const VaultsClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedVaultId, vaultDetails, vaultAddress, setSelectedVaultId } = useVaultStore();

  useEffect(() => {
    const vid = searchParams.get('vid');

    // If no vid in URL, redirect to dashboard
    if (!vid) {
      router.push('/dashboard');
      return;
    }

    // Check if vid is valid
    if (!VAULT_IDS.includes(vid as any)) {
      router.push('/dashboard');
      return;
    }

    // If vid is valid but different from selected vault, update the state
    if (vid !== selectedVaultId) {
      setSelectedVaultId(vid);
    }
  }, [searchParams, selectedVaultId, router, setSelectedVaultId]);

  // Get current vault configuration
  const currentVault = selectedVaultId ? VAULT_CONFIGS[selectedVaultId as keyof typeof VAULT_CONFIGS] : null;

  if (!currentVault) {
    return null; // or a loading state
  }

  return (
    <div className="flex w-full !pb-20 overflow-y-auto">
      <div className="w-full flex flex-col p-md">
        {/* Header */}
        <div className="w-full flex flex-col gap-md mb-2">
          <div className="flex gap-2 !items-center my-2">
            <BackButton />
            <Image src={currentVault.icon} alt={selectedVaultId || 'Vault'} className="w-8 h-8 mt-2" />
            <Typography as="h1" variant="h4-bold" className="mt-1">
              {selectedVaultId}
            </Typography>
          </div>
          <Typography as="p" variant="p-medium" className="text-muted-foreground">
            The {selectedVaultId} combines Yearn yields with DWF Labs&apos; CEX trading in{' '}
            {currentVault.duration.toLowerCase()} epochs. {currentVault.symbol} deposits earn Yearn APY when idle, while
            DWF can borrow funds for market making, returning profits at epoch end.
          </Typography>
        </div>

        {/* Epoch */}
        <Slider />

        {/* panes */}
        <div className="grid grid-cols-2 divide-x divide-background border border-background bg-secondary my-2">
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel label="TYPE" prop={<small className="font-mono underline">{currentVault.type}</small>} />
            <Panel label="CONTRACT" prop={<small className="font-mono">{currentVault.duration}</small>} />
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
                  <span className="text-muted-foreground">{currentVault.symbol}</span>
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
