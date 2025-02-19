import { Metadata } from 'next';

import Body from './components/body';
import Sidepanel from './components/sidepanel';

import { OPEN_GRAPH_BASE_DATA } from '@/consts/metadata';

export const metadata: Metadata = {
  title: 'xSYK Staking | Stryke',
  description: 'Stake xSYK to earn lucrative rewards.',
  openGraph: {
    title: 'xSYK Staking | Stryke',
    description: 'Stake xSYK to earn lucrative rewards.',
    ...OPEN_GRAPH_BASE_DATA,
  },
};

const XSykStakingRoot = () => {
  return (
    <div className="relative flex h-full justify-center items-center bg-primary border-t border-background">
      <div className="flex w-[900px] h-auto border-[1px] border-background divide-x divide-background">
        <Body />
        <Sidepanel />
      </div>
    </div>
  );
};

export default XSykStakingRoot;
