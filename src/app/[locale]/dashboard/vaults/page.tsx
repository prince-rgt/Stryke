import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';

import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import Panel from './components/Panel';
import Performance from './components/Performance';
import Positions from './components/Positions';
import SideNav from './components/sidenav';
import Timeline from './components/Timeline';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

import { Arbitrum, BTC } from '../../../../assets/images';

export const metadata: Metadata = {
  title: 'Vaults | Stryke',
  description: 'View all available option markets and your trading performance on Stryke.',
  openGraph: {
    title: 'Vaults | Stryke',
    description: 'View all available option markets and your trading performance on Stryke.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

const Vaults: React.FC = () => {
  return (
    <div className="flex w-full !pb-20 overflow-y-auto">
      <div className="w-full flex flex-col p-md">
        {/* Header */}
        <div className="w-full flex flex-col gap-md mb-2">
          <div className="flex gap-2 !items-center my-2">
            <span>
              <ChevronLeft size={18} className="opacity-50 text-xl mr-4" />
            </span>
            <Image src={BTC} alt="Bitcoin" className="w-8 h-8 mt-1" />
            <Typography as="h1" variant="h4-bold">
              {' '}
              WBTC Superbull{' '}
            </Typography>
          </div>
          <Typography as="p" variant="p-medium" className="text-muted-foreground">
            The BTC Superbull Monthly Vault combines Yearn yields with DWF Labs&apos; CEX trading in monthly epochs.
            WBTC deposits earn Yearn APY when idle, while DWF can borrow funds for market making, returning profits at
            epoch end.
          </Typography>
        </div>

        {/* Epoch */}
        <div className="flex gap-2 items-center my-2">
          <ChevronLeft size={18} className="mr-4 opacity-50" />
          <div className="bg-[#3C3C3C] w-[8.75rem] rounded">
            <Input type="number" placeholder="Epoch 2" className="w-full bg-transparent border-0 px-[5px]" />
          </div>
          <button className="px-2 bg-secondary font-medium text-[#EBFF00] font-mono h-full text-sm rounded flex items-center">
            <span>LIVE</span>
          </button>
          <ChevronRight size={18} className="ml-4 opacity-50" />
        </div>

        {/* panes */}
        <div className="grid grid-cols-2 divide-x divide-background border border-background bg-secondary my-2">
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel label="TYPE" prop={<small className="font-mono underline">HYBRID</small>} />
            <Panel label="CONTRACT" prop={<small className="font-mono">WEEKLY</small>} />
          </div>
          <div className="grid-row-2 grid divide-y divide-background">
            <Panel
              label="DURATION"
              value={
                <div className="flex gap-2 !items-center">
                  <span>0x131...131</span>
                  <Image src={Arbitrum} alt="" />
                </div>
              }
            />
            <Panel
              label="TVL"
              value={
                <div className="flex gap-2">
                  <span>311.11</span>
                  <span className="text-muted-foreground">WBTC</span>
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

        {/* Timeline */}
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

export default Vaults;
