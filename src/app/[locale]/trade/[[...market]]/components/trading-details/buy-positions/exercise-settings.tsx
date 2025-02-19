import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Typography } from '@/components/ui/typography';

import { Swapper, SwapperDisplayLabels } from './hooks/useBuyPositionsData';

const ExerciseSettings = ({
  selectedSwapperId,
  setSelectedSwapperId,
  slippage,
  setSlippage,
  defaultSlippage,
  defaultSwapper,
  availableSwappers,
}: {
  selectedSwapperId: Swapper;
  setSelectedSwapperId: (id: Swapper) => void;
  slippage: number;
  setSlippage: (slippage: number) => void;
  defaultSlippage: number;
  defaultSwapper: Swapper;
  availableSwappers: Swapper[];
}) => {
  const [tempSlippage, setTempSlippage] = useState<number>(slippage);
  const [tempSwapperId, setTempSwapperId] = useState<Swapper>(selectedSwapperId);
  const handleReset = useCallback(() => {
    setTempSwapperId(defaultSwapper);
    setTempSlippage(defaultSlippage);
  }, [defaultSlippage, defaultSwapper]);

  const handleApply = useCallback(() => {
    setSelectedSwapperId(tempSwapperId);
    setSlippage(tempSlippage);
  }, [setSelectedSwapperId, setSlippage, tempSlippage, tempSwapperId]);

  const handleClose = useCallback(
    (open: boolean) => {
      const isClose = !open;
      if (isClose) {
        setTempSwapperId(selectedSwapperId);
        setTempSlippage(slippage);
      }
    },
    [selectedSwapperId, slippage],
  );

  return (
    <Dialog onOpenChange={handleClose}>
      <DialogTrigger className="items-center">
        <Button className="flex items-center text-foreground/80 hover:text-foreground" variant={'ghost'} size={'sm'}>
          <MixerHorizontalIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-[320px] flex-col p-0">
        <Typography variant={'p-bold'}>Exercise Settings</Typography>
        <div className="mt-md flex items-center justify-between">
          <Typography className="mr-md" variant={'p-medium'}>
            Swapper
          </Typography>
          <ToggleGroup
            value={tempSwapperId}
            type="single"
            onValueChange={(value: Swapper) => value && setTempSwapperId(value)}>
            {availableSwappers.map((swapper) => (
              <ToggleGroupItem key={swapper} value={swapper}>
                {SwapperDisplayLabels[swapper]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="my-md flex items-center justify-between">
          <Typography className="mr-md" variant={'p-medium'}>
            Slippage
          </Typography>
          <div className="flex items-center">
            <Input
              className="mr-1 w-10"
              size={'sm'}
              type="number"
              value={tempSlippage}
              onChange={(e) => setTempSlippage(Number(e.target.value))}
            />
            <Typography variant={'small-regular'}>%</Typography>
          </div>
        </div>

        <Button size={'sm'} onClick={handleReset} className="mb-sm w-fit" variant={'secondary'}>
          Reset to Defaults
        </Button>
        <div className="flex w-full space-x-md">
          <DialogClose className="w-full">
            <Button size={'sm'} className="w-full" variant={'secondary'}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose className="w-full">
            <Button size={'sm'} className="w-full" onClick={handleApply}>
              Apply
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseSettings;
