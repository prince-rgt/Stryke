import Image from 'next/image';

import { Yearn } from '@/assets/images';

import Panel from './Panel';

const Performance = () => {
  return (
    <div className="w-full flex bg-secondary">
      <div className="w-1/2 border-r-2 border-black grid-row-1 grid divide-y divide-background">
        <Panel
          label="EPOCH PROGRESS"
          prop={
            <div className="flex h-1 w-1/3 items-center rounded-full bg-gray-600">
              <div className="h-1 rounded-full bg-success" style={{ width: `${20}%` }}></div>
            </div>
          }
        />
        <Panel
          label="BORROWED AMOUNT"
          value={
            <div className="flex gap-2 !items-center">
              <span>31.13</span>
              <span>WBTC</span>
            </div>
          }
        />
        <Panel label="UTILIZATION RATE" value={<span>{33} %</span>} />
        <Panel
          label="YEARN YIELD"
          labelClasses="underline"
          value={
            <div className="flex gap-2 !items-center">
              <span className="text-[#43E6F2] mt-0.5">3.41%</span>
              <Image src={Yearn} alt="" />
            </div>
          }
        />
        <Panel
          label="MARKET MAKER PNL"
          labelClasses="underline underline:bg-blue-500"
          value={<span className="text-[#EBFF00]">3.41%</span>}
        />
      </div>

      {/* Chart */}
      <div className="w-1/2 text-xs p-3">
        <div className="border-2 border-black flex justify-center items-center h-full">- Chart -</div>
      </div>
    </div>
  );
};

export default Performance;
