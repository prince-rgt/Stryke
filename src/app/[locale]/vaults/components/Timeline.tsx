import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

import { ButtonV1 } from './Buttons';
import Panel from './Panel';

const Timeline = () => {
  return (
    <div className="w-full">
      {/* Epoch */}
      <div className="bg-secondary p-2">
        <div className="flex justify-between uppercase font-mono text-xs text-muted-foreground">
          <span>Previous</span>
          <span className="text-white">Current</span>
          <span className="underline">Deposit Open</span>
        </div>
        <div className="flex justify-between uppercase my-1.5 items-center">
          <ButtonV1 classes="bg-[#3C3C3C] !text-muted-foreground" label="Epoch 1" />
          <div className="h-[1px] flex-grow mx-2 bg-muted-foreground"></div>
          <ButtonV1 classes="bg-white text-black" label="Epoch 2" />
          <div className="h-[1px] flex-grow mx-2 bg-muted-foreground"></div>
          <ButtonV1 classes="bg-[#3C3C3C] text-[#EBFF00]" label="Epoch 3" />
        </div>
        <div className="flex justify-between uppercase font-mono text-xs text-muted-foreground">
          <span>Feb 1, 2025</span>
          <span className="text-white">Feb 8, 2025</span>
          <span>Feb 15, 2025</span>
        </div>
      </div>

      {/* Panel */}
      <div className="grid grid-cols-2 divide-x divide-background border-2 border-black bg-secondary mb-2 items-center">
        <Panel
          label="NEXT EPOCH"
          value={
            <>
              <span>5D 12H 30M</span>
            </>
          }
        />
        <Panel
          label="NEXT EPOCH TVL"
          value={
            <div className="flex gap-2">
              <span>$ {'890123'}</span>
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
