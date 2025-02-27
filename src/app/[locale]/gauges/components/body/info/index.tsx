import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useToggle } from 'react-use';

import { cn } from '@/utils/styles';

import { Link } from '@/navigation';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { Typography } from '@/components/ui/typography';
import Panel from '@/app/[locale]/gauges/components/body/info/panel';
import InfoChart from '@/app/[locale]/gauges/components/info-chart';

import useGaugeControllerStore from '../../../hooks/store/useGaugeControllerStore';

import CustomCountdown from '../../custom-countdown';

const Info = () => {
  const [isCollapsed, toggle] = useToggle(true);
  const { epoch, totalXsyk } = useGaugeControllerStore();

  if (epoch.epochEnd === BigInt(0))
    return (
      <div className="flex w-full flex-col gap-md">
        <div className="grid grid-cols-2 divide-x divide-background border border-background bg-secondary">
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel label="TOTAL VOTEABLE XSYK" prop={<Skeleton className="w-1/3" />} />
            <Panel label="EPOCH PROGRESS" prop={<Skeleton className="w-1/3" />} />
          </div>
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel label="EPOCH" prop={<Skeleton className="w-1/3" />} />
            <Panel label="VOTING ENDS IN" prop={<Skeleton className="w-1/3" />} />
          </div>
        </div>
        <Collapsible className="data-[state=open]:flex-grow" open={isCollapsed}>
          <div className="flex cursor-pointer items-center" onClick={toggle}>
            <ChevronDown size={24} className={cn('mr-2 text-muted', { 'rotate-180': isCollapsed })} />
            <Typography variant="p-bold">How It Works</Typography>
          </div>
          <CollapsibleContent className="mt-md flex-grow data-[state=open]:h-fit">
            <div className="flex bg-secondary p-md">
              <div className="border border-background">
                <InfoChart />
              </div>
              <div className="ml-2 flex flex-col justify-between">
                <>
                  <Typography variant="small-medium" className="mb-md text-muted-foreground">
                    Vote with your XSYK balance
                  </Typography>
                  <Typography variant="small-medium" className="mb-md">
                    Get XSYK and vote with your <span className="text-highlight">XSYK</span> balance to determine reward
                    emissions for specific markets. Your total voteable balance is your unallocated and allocated{' '}
                    <span className="text-highlight">XSYK </span>balances.
                    <br />
                    <br />
                    You can only change weights once every seven days.
                  </Typography>
                </>
                <Link
                  className="w-full"
                  target="_blank"
                  href="https://blog.stryke.xyz/articles/introducing-reward-gauges-maximizing-lp-rewards-in-weth-and-wbtc-markets">
                  <Button variant="secondary" size="sm">
                    <Typography variant="small-medium">Gauges</Typography>
                    <OpenInNewWindowIcon width={16} height={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );

  // calculates the progress percentage of the epoch
  const now = BigInt(Math.floor(Date.now() / 1000));
  const epochStart = epoch.epochEnd - epoch.epochLength;
  const elapsedTime = now - epochStart;
  const progressPercentage = Number(((elapsedTime * BigInt(100)) / epoch.epochLength).toString());

  // Ensure the percentage is between 0 and 100
  const clampedProgressPercentage = Math.max(0, Math.min(100, progressPercentage));

  return (
    <div className="flex w-full flex-col gap-md">
      <div className="grid grid-cols-2 divide-x divide-background border border-background bg-secondary">
        <div className="grid-row-2 grid divide-y divide-background">
          <Panel label="TOTAL VOTEABLE XSYK" value={(Number(totalXsyk) / 1e18).toFixed(2)} />
          <Panel
            label="EPOCH PROGRESS"
            prop={
              <div className="flex h-1 w-1/3 items-center rounded-full bg-gray-600">
                <div className="h-1 rounded-full bg-success" style={{ width: `${clampedProgressPercentage}%` }}></div>
              </div>
            }
          />
        </div>
        <div className="grid-row-2 grid divide-y divide-background">
          <Panel label="EPOCH" value={epoch.epoch.toString()} />
          <Panel
            label="VOTING ENDS IN"
            value={
              <div>
                <CustomCountdown date={Number(epoch.epochEnd) * 1000} variant="extra-small-regular" />
              </div>
            }
          />
        </div>
      </div>
      <Collapsible className="data-[state=open]:flex-grow" open={isCollapsed}>
        <div className="flex cursor-pointer items-center" onClick={toggle}>
          <ChevronDown size={24} className={cn('mr-2 text-muted', { 'rotate-180': isCollapsed })} />
          <Typography variant="p-bold">How It Works</Typography>
        </div>
        <CollapsibleContent className="mt-md flex-grow data-[state=open]:h-fit">
          <div className="flex bg-secondary p-md">
            <div className="border border-background">
              <InfoChart />
            </div>
            <div className="ml-2 flex flex-col justify-between">
              <>
                <Typography variant="small-medium" className="mb-md text-muted-foreground">
                  Vote with your XSYK balance
                </Typography>
                <Typography variant="small-medium" className="mb-md">
                  Get XSYK and vote with your <span className="text-highlight">XSYK</span> balance to determine reward
                  emissions for specific markets. Your total voteable balance is your unallocated and allocated{' '}
                  <span className="text-highlight">XSYK </span>balances.
                  <br />
                  <br />
                  You can only change weights once every seven days.
                </Typography>
              </>
              <Link
                className="w-full"
                target="_blank"
                href="https://blog.stryke.xyz/articles/introducing-reward-gauges-maximizing-lp-rewards-in-weth-and-wbtc-markets">
                <Button variant="secondary" size="sm">
                  <Typography variant="small-medium">Gauges</Typography>
                  <OpenInNewWindowIcon width={16} height={16} />
                </Button>
              </Link>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Info;
