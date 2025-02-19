import { Pencil2Icon } from '@radix-ui/react-icons';
import { formatUnits } from 'viem';

import { Button } from '@/components/ui/button';
import NumberDisplay from '@/components/ui/number-display';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

import { FormattedPosition } from '../../hooks/useDepositsPositionsData';

import ReserveSection from './reserve-section';
import WithdrawReserved from './withdraw-reserved';

// import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Reserve = ({ positionData }: { positionData: FormattedPosition }) => {
  const { reserved } = positionData;

  return (
    <div className="flex w-48 items-center">
      <div className="flex flex-col">
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(reserved.amount0), reserved.amount0Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${reserved.amount0Symbol}`}
        </Typography>
        <Typography variant="small-medium">
          <NumberDisplay
            value={Number(formatUnits(BigInt(reserved.amount1), reserved.amount1Decimals))}
            format="tokenAmount"
            precision={5}
          />
          {` ${reserved.amount1Symbol}`}
        </Typography>
      </div>
      <Popover>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger> */}
        <PopoverTrigger asChild>
          <Button className="ml-auto" size={'sm'} variant={'secondary'}>
            Reserve
            <Pencil2Icon />
          </Button>
        </PopoverTrigger>
        {/* </TooltipTrigger>
            <TooltipContent>Manage Reserves</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
        <PopoverContent
          inPortal={false}
          collisionPadding={20}
          // max-h-[var(--radix-popover-content-available-height)]
          className="max-h-[var(--radix-popover-content-available-height)] w-[400px] space-y-md overflow-auto bg-primary"
          align="center">
          <ReserveSection positionData={positionData} />
          <Separator />
          <WithdrawReserved positionData={positionData} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Reserve;
