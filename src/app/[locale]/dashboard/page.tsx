import { OpenInNewWindowIcon } from '@radix-ui/react-icons';
import { Metadata } from 'next';
import Image from 'next/image';

import { ButtonV2 } from './vaults/components/Buttons';
import CardItem from './vaults/components/Cards';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

import { BTC, DashboardChart, ETH } from '../../../assets/images';

export const metadata: Metadata = {
  title: 'Dashboard | Stryke',
  description: 'View all available option markets and your trading performance on Stryke.',
  openGraph: {
    title: 'Dashboard | Stryke',
    description: 'View all available option markets and your trading performance on Stryke.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

const Dashboard: React.FC = () => {
  return (
    <div className="p-5 overflow-y-auto">
      <h1 className="font-black text-3xl py-4">Vaults.</h1>
      <p className="text-md font-medium w-2/5 text-muted-foreground">
        Simplify and automate your trading strategy by depositing into one of Stryke's vaults that utilize various
        strategies that are centralized, decentralized or a hybrid.
      </p>

      {/* Categories */}
      <div className="my-6">
        <h1 className="font-black text-xl py-2">Sorted by Strategies</h1>

        <div className="flex gap-0.5 my-2 text-sm">
          <button className="px-3 py-2 bg-[#3C3C3C] font-medium text-white">Call Spreads</button>
          <button className="px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40">Reversal</button>
          <button className="px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40">Bidirectional Hedge</button>
          <button className="px-3 py-2 bg-[#3C3C3C]/70 font-medium text-white/40">Fixed Range Liquidity</button>
        </div>

        <div className="bg-[#202020] border-2 border-black p-3 flex gap-4 w-full my-4">
          <div className="w-4/12 border border-black flex justify-center items-center text-white/50">
            <Image src={DashboardChart} alt="- chart -" className="w-full" />
          </div>
          <div className="w-8/12 text-sm flex flex-col gap-8 justify-between">
            <div>
              <h2 className="text-muted-foreground mb-3">Call Spreads Explained</h2>
              <p>
                A call spread buys a call on a strike, and selling another call on a higher strike of the same expiry.
                They work well if you intend to profit from a moderate increase in the price of the underlying asset.
              </p>
            </div>
            <button className="p-2 bg-[#3C3C3C] font-medium text-white flex gap-2 text-sm w-[8rem]">
              <OpenInNewWindowIcon className="h-4 w-4" />
              <span>Call Spreads</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex my-2 flex-wrap">
          <CardItem
            header="BTC Superbull Monthly"
            imgSrc={BTC}
            percentages={
              <span>
                {13.31}% - {491.11}%
              </span>
            }>
            <ButtonV2 label="MONTHLY" />
            <ButtonV2 label="DEPOSIT WBTC" />
            <ButtonV2 label="CENTRALIZED" />
            <ButtonV2 label="EXTRA REWARDS" classes="text-[#EBFF00]" />
          </CardItem>

          <CardItem
            header="ETH Superbull Monthly"
            imgSrc={ETH}
            hasdollar={true}
            percentages={
              <span>
                {13.31}% - {491.11}%
              </span>
            }>
            <ButtonV2 label="QUARTERLY" />
            <ButtonV2 label="DEPOSIT WETH" />
            <ButtonV2 label="CENTRALIZED" />
            <ButtonV2 label="EXTRA REWARDS" classes="text-[#EBFF00]" />
          </CardItem>

          <CardItem
            header="ETH Superbull Quarterly"
            imgSrc={ETH}
            hasdollar={true}
            percentages={
              <span>
                {13.31}% - {491.11}%
              </span>
            }>
            <ButtonV2 label="QUARTERLY" />
            <ButtonV2 label="DEPOSIT ETH" />
            <ButtonV2 label="CENTRALIZED" />
            <ButtonV2 label="EXTRA REWARDS" classes="text-[#EBFF00]" />
          </CardItem>

          <CardItem
            header="ETH Superbull Monthly"
            imgSrc={ETH}
            hasdollar={true}
            percentages={
              <span>
                {13.31}% - {491.11}%
              </span>
            }>
            <ButtonV2 label="MONTHLY" />
            <ButtonV2 label="DEPOSIT ETH" />
            <ButtonV2 label="CENTRALIZED" />
            <ButtonV2 label="EXTRA REWARDS" classes="text-[#EBFF00]" />
          </CardItem>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
