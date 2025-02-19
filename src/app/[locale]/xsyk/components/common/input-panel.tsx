import Image from 'next/image';
import { useCallback } from 'react';
import { formatUnits } from 'viem';

import { Input } from '@/components/ui/input';
import NumberDisplay from '@/components/ui/number-display';
import { Typography } from '@/components/ui/typography';

type Props = {
  tokenInfo: {
    balance: bigint;
    imgSrc: string;
    name: string;
    decimals: number;
  };
  amount: string;
  setAmount: (value: React.SetStateAction<string>) => void;
};

export const InputPanel = (props: Props) => {
  const { tokenInfo, amount, setAmount } = props;

  const handleMax = useCallback(() => {
    setAmount(formatUnits(tokenInfo.balance, 18));
  }, [setAmount, tokenInfo.balance]);

  const handleChange = (e: any) => {
    setAmount(e.target.value);
  };

  return (
    <div className="bg-selected p-md gap-lg space-y-md rounded-sm">
      <div>
        <Typography variant="small-medium">Amount</Typography>
        <div className="flex justify-between items-center">
          <Input
            placeholder="0"
            value={amount}
            type="number"
            onChange={handleChange}
            className="text-foreground text-lg pl-0"
            variant="ghost"
            size="lg"
          />
          <div className="flex p-sm h-[24px] rounded-sm bg-muted gap-x-sm items-center my-auto min-w-fit">
            <Image src={tokenInfo.imgSrc} alt={tokenInfo.name} width={20} height={20} />
            <Typography variant="small-medium" className="my-auto">
              {tokenInfo.name}
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <div className="flex gap-x-md text-foreground">
          <span className="flex text-muted-foreground space-x-1">
            <Typography variant="small-medium">Balance:</Typography>
            <Typography variant="small-medium" className="">
              <NumberDisplay value={Number(formatUnits(tokenInfo.balance, tokenInfo.decimals))} format="tokenAmount" />
            </Typography>
          </span>
          <Typography variant="small-medium" role="button" onClick={handleMax}>
            Max
          </Typography>
        </div>
      </div>
    </div>
  );
};
