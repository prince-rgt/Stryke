import { useChainModal } from '@rainbow-me/rainbowkit';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import GaugeSelector from './components/gauge-selector';
import TransactionModalUncontrolled, { Transaction } from '@/app/[locale]/components/transaction-modal-uncontrolled';

import useGaugeControllerStore from '../../hooks/store/useGaugeControllerStore';
import useGaugeController from '../../hooks/useGaugeController';

import GaugeController from '@/abi/GaugeController';

import { CHAINS } from '@/consts/chains';

import CustomCountdown from '../custom-countdown';
import QuickLinks from './quick-links';
import GaugeVoteSelector from './vote';

const SidePanel: React.FC = () => {
  const [isCollapsed, setCollapsed] = React.useState(false);
  const { chainId } = useAccount();
  const { openChainModal } = useChainModal();

  const {
    selectedRow,
    voteAmount,
    accountPowerUsedPerEpoch,
    XsykBalance,
    epoch,
    totalPowerUsedPerEpoch,
    updateSelectedRow,
  } = useGaugeControllerStore();
  const { gaugeControllersByChain, voteTransaction, setVoteAmount, gaugeReads } = useGaugeController();

  const transactions = useMemo(() => {
    if (!voteTransaction || !chainId || !gaugeControllersByChain[chainId] || !selectedRow) {
      return [];
    }

    return [
      {
        enabled: voteAmount > 0 && voteTransaction !== null,
        description: `Voting ${Number(voteAmount) / 1e18} xSYK on the ${selectedRow.name} gauge`,
        txParams: [
          {
            abi: GaugeController,
            address: gaugeControllersByChain[chainId],
            functionName: 'vote',
            args: voteTransaction,
          },
        ],
      },
    ];
  }, [voteAmount, voteTransaction, gaugeControllersByChain, selectedRow, chainId]) as Transaction[];

  const toggle = () => {
    setCollapsed(!isCollapsed);
  };

  const currentWeight = useMemo(() => {
    if (selectedRow?.userWeight != null && totalPowerUsedPerEpoch !== 0n) {
      return Number(selectedRow.userWeight / BigInt(1e18));
    }
    return 0;
  }, [selectedRow, totalPowerUsedPerEpoch]);

  const nextWeight = useMemo(() => {
    return currentWeight + Number(voteAmount) / 1e18;
  }, [voteAmount, currentWeight]);

  if (epoch.epochEnd === BigInt(0))
    return (
      <div className="flex w-1/3 flex-col divide-y divide-background bg-secondary">
        <Skeleton></Skeleton>
      </div>
    );
  // Convert epochEnd to milliseconds and create Date objects
  const endDate = new Date(Number(epoch.epochEnd) * 1000);
  const startDate = new Date((Number(epoch.epochEnd) - Number(epoch.epochLength)) * 1000);

  // Format dates as strings (e.g., "17-07-2024")
  const formattedStartDate = format(startDate, 'dd-MM-yyyy');
  const formattedEndDate = format(endDate, 'dd-MM-yyyy');

  return (
    <div className="flex w-1/3 flex-col divide-y divide-background bg-secondary">
      <div className="gap-md p-md">
        {selectedRow != null ? (
          <div>
            <GaugeVoteSelector maxVoteAmount={XsykBalance - accountPowerUsedPerEpoch} />
          </div>
        ) : (
          <div className="flex flex-col gap-md rounded-sm border border-foreground/15 bg-alert-gradient p-md">
            <Typography className="text-foreground" variant="small-medium">
              Select A Gauge to Begin
            </Typography>
            <Typography variant="small-medium">
              To start voting, select a gauge from the table or select one from the dropdown.
            </Typography>
            <GaugeSelector />
          </div>
        )}
        <Collapsible open={!isCollapsed} onOpenChange={toggle} className="mb-md">
          <div className="grid-row-2 grid gap-md divide-y divide-selected">
            <div className="flex flex-row justify-between">
              <CollapsibleTrigger>
                <Button variant={'ghost'} onClick={toggle}>
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Typography variant="small-medium" className="text-muted-foreground">
                    Voting Ends In
                  </Typography>
                </Button>
              </CollapsibleTrigger>
              <div className="flex items-center">
                <CustomCountdown date={Number(epoch.epochEnd) * 1000} variant="small-medium" />
              </div>
            </div>
            <CollapsibleContent className="ml-5">
              <div className="mt-3 flex flex-col gap-sm">
                <div className="flex flex-row justify-between">
                  <Typography variant="small-medium" className="text-muted-foreground">
                    Current Epoch
                  </Typography>
                  <Typography variant="small-medium">{formattedStartDate}</Typography>
                </div>
                <div className="flex flex-row justify-between">
                  <Typography variant="small-medium" className="text-muted-foreground">
                    Next Epoch
                  </Typography>
                  <Typography variant="small-medium">{formattedEndDate}</Typography>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
        <div className="flex flex-col gap-md">
          <div className="flex flex-row justify-between">
            <Typography variant="small-medium" className="text-muted-foreground">
              Current Weight
            </Typography>
            <Typography variant="small-medium">{currentWeight.toFixed(2)}</Typography>
          </div>
          <div className="flex flex-row justify-between">
            <Typography variant="small-medium" className="text-muted-foreground">
              Next Weight
            </Typography>
            <Typography variant="small-medium">{nextWeight.toFixed(2)}</Typography>
          </div>
          {selectedRow?.chain === chainId ? (
            <TransactionModalUncontrolled
              onClose={(complete) => {
                if (complete) {
                  setVoteAmount(0n);
                  gaugeReads();
                  updateSelectedRow(null);
                }
              }}
              successMsg="Vote Successful"
              disabled={selectedRow == null || voteAmount == 0n || !voteTransaction || transactions.length === 0}
              transactions={transactions}>
              <Button>
                <Typography variant="small-medium">
                  {selectedRow == null
                    ? 'Select a Gauge to vote for'
                    : voteAmount === 0n
                      ? 'Amount can not be 0'
                      : 'Vote'}
                </Typography>
              </Button>
            </TransactionModalUncontrolled>
          ) : selectedRow ? (
            <div className="flex flex-row w-full justify-center">
              <Button onClick={openChainModal} variant={'secondary'} className="w-full p-2">
                <Typography variant="small-medium" className="capitalize">
                  Switch to {CHAINS[selectedRow?.chain ? selectedRow.chain : 42161].name} to Vote.
                </Typography>
              </Button>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <Button onClick={openChainModal} variant={'secondary'} className="w-full p-2" disabled={true}>
                <Typography variant="small-medium">Select a Gauge to vote for</Typography>
              </Button>
            </div>
          )}
        </div>
      </div>
      <QuickLinks />
    </div>
  );
};

export default SidePanel;
