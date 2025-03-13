import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import getEpochData from '@/utils/actions/varrock/getEpochData';
import getVaultDetails from '@/utils/actions/varrock/getVaultDetails';
import { formatDate } from '@/utils/helpers';

import useVaultStore from '../../store/VaultStore';
import { ButtonV1 } from './Buttons';
import Panel from './Panel';

const Timeline = () => {
  const { getSelectedVaultAddress, selectedVaultId, userAddress } = useVaultStore();

  const [epochs, setEpochs] = useState<{
    previous: { id: bigint; date: Date | null };
    current: { id: bigint; date: Date | null };
    next: { id: bigint; date: Date | null };
  } | null>(null);
  const [nextEpochTVL, setNextEpochTVL] = useState<string | null>(null);
  const [timeToNextEpoch, setTimeToNextEpoch] = useState<string>('');

  useEffect(() => {
    const fetchVaultDetails = async () => {
      try {
        const vaultAddress = getSelectedVaultAddress();
        const vaultDetails = await getVaultDetails(vaultAddress!, userAddress as `0x${string}`);

        const currentEpochId = vaultDetails.currentEpoch;

        const previousEpochId = currentEpochId > 0n ? currentEpochId - 1n : 0n;
        const nextEpochId = currentEpochId + 1n;

        const currentEpochData = await getEpochData(vaultAddress!, currentEpochId, vaultDetails.decimals);
        const previousEpochData =
          previousEpochId > 0n
            ? await getEpochData(vaultAddress!, previousEpochId, vaultDetails.decimals)
            : { startTime: null };

        const nextEpochStartTime =
          currentEpochData.endTime ||
          (currentEpochData.startTime && vaultDetails.epochDuration
            ? new Date(currentEpochData.startTime.getTime() + Number(vaultDetails.epochDuration) * 1000)
            : new Date(Date.now() + Number(vaultDetails.epochDuration) * 1000));

        setEpochs({
          previous: { id: previousEpochId, date: previousEpochData.startTime },
          current: {
            id: currentEpochId,
            date: currentEpochData.startTime ? currentEpochData.startTime : new Date(Date.now()),
          },
          next: { id: nextEpochId, date: nextEpochStartTime },
        });

        setNextEpochTVL(vaultDetails.totalAssets);
      } catch (err) {
        console.error('Error fetching vault details:', err);
      }
    };

    if (selectedVaultId && userAddress) {
      fetchVaultDetails();
    }
  }, [getSelectedVaultAddress, selectedVaultId, userAddress]);

  useEffect(() => {
    const updateCountdown = () => {
      if (epochs?.next?.date) {
        const now = new Date();
        const diff = epochs.next.date.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeToNextEpoch('0D 0H 0M 0S');
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeToNextEpoch(`${days}D ${hours}H ${minutes}M ${seconds}S`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [epochs]);

  return (
    <div className="w-full">
      {/* Epoch */}
      <div className="bg-secondary p-2">
        <div className="flex justify-between uppercase font-mono text-xs text-muted-foreground">
          <span>Previous</span>
          <span className="text-white ml-5">Current</span>
          <span className="underline">Deposit Open</span>
        </div>
        <div className="flex justify-between uppercase my-1.5 items-center">
          <ButtonV1 classes="bg-[#3C3C3C] !text-muted-foreground" label={`Epoch ${epochs?.previous?.id.toString()}`} />
          <div className="h-[1px] flex-grow mx-2 bg-muted-foreground"></div>
          <ButtonV1 classes="bg-white text-black" label={`Epoch ${epochs?.current?.id.toString()}`} />
          <div className="h-[1px] flex-grow mx-2 bg-muted-foreground"></div>
          <ButtonV1 classes={`bg-[#3C3C3C] 'text-[#EBFF00]'`} label={`Epoch ${epochs?.next?.id.toString()}`} />
        </div>
        <div className="flex justify-between uppercase font-mono text-xs text-muted-foreground">
          <span>{formatDate(epochs?.previous?.date as Date)}</span>
          <span className="text-white">{formatDate(epochs?.current?.date as Date)}</span>
          <span>{formatDate(epochs?.next?.date as Date)}</span>
        </div>
      </div>

      {/* Panel */}
      <div className="grid grid-cols-2 divide-x divide-background border-2 border-black bg-secondary mb-2 items-center">
        <Panel
          label="NEXT EPOCH"
          value={
            <>
              <span>{timeToNextEpoch}</span>
            </>
          }
        />
        <Panel
          label="NEXT EPOCH TVL"
          value={
            <div className="flex gap-2">
              <span>$ {parseFloat(nextEpochTVL?.toString() || '0').toLocaleString()}</span>
              <span className="text-muted-foreground">
                <QuestionMarkCircledIcon />
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Timeline;
